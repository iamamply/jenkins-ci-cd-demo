pipeline {
    agent {
        // กำหนด Pod Agent ให้มี BuildKit และรันแบบ Rootless
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: buildkit-agent
    // *** NOTE: ตรวจสอบให้แน่ใจว่า Image นี้มี kubectl ติดตั้งอยู่ด้วย! ***
    // (moby/buildkit:rootless อาจจะไม่มีkubectl คุณอาจต้องสร้าง Image เอง)
    image: "moby/buildkit:rootless" 
    command: ["/bin/sh", "-c", "cat"]
    tty: true
    securityContext:
      runAsUser: 1000 
      runAsGroup: 1000
    volumeMounts:
    - name: buildkit-cache-volume
      mountPath: /var/lib/buildkit
  volumes:
  - name: buildkit-cache-volume
    emptyDir: {}
'''
        }
    }

    environment {
        CONTAINER_NAME = "buildkit-agent" 
        DOCKER_IMAGE = "iamamply/ci-cd-app" 
        CACHE_REPO = "iamamply/ci-cd-app-cache" // ต้องมี Repo นี้ใน Docker Hub
    }

    stages {
        stage('1. Checkout Code') {
            steps { container(env.CONTAINER_NAME) { checkout scm } }
        }
        
        stage('2. Build & Push Docker Image (BuildKit)') {
            steps {
                container(env.CONTAINER_NAME) {
                    script {
                        // สร้าง Tag จาก Timestamp
                        env.IMAGE_TAG = sh(returnStdout: true, script: 'date +%Y%m%d%H%M%S').trim()
                        def FULL_IMAGE = "${env.DOCKER_IMAGE}:${env.IMAGE_TAG}"

                        // 1. จัดการ Authentication สำหรับ BuildKit
                        withCredentials([usernamePassword(credentialsId: 'docker-hub-credential', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USER')]) {
                            sh """
                            # สร้าง config.json ใน Home Directory ของ BuildKit User
                            mkdir -p /home/user/.docker
                            echo '{"auths":{"index.docker.io/v1/": {"username":"${DOCKER_USER}", "password":"${DOCKER_PASSWORD}"}}}' > /home/user/.docker/config.json
                            
                            echo "Starting BuildKit build for: ${FULL_IMAGE}"
                            
                            # 2. คำสั่ง Build และ Push
                            /usr/bin/buildctl-daemonless.sh build \\
                                --frontend=dockerfile.v0 \\
                                --local context=. \\
                                --local dockerfile=Dockerfile \\
                                --progress=plain \\
                                \\
                                --output type=image,name=${FULL_IMAGE},push=true \\
                                \\
                                --import-cache type=registry,ref=${env.CACHE_REPO}:latest \\
                                --export-cache type=registry,ref=${env.CACHE_REPO}:latest
                            """
                        }
                    }
                }
            }
        }
        
        stage('3. Deploy to Kubernetes') {
            steps {
                container(env.CONTAINER_NAME) {
                    // *** คำสั่งนี้จะทำงานได้ต่อเมื่อ Agent Container มี kubectl ติดตั้งอยู่ ***
                    sh "kubectl set image deployment/ci-cd-app-deployment ci-cd-app-container=${DOCKER_IMAGE}:${IMAGE_TAG}"
                    sh "kubectl rollout status deployment/ci-cd-app-deployment --timeout=120s"
                }
            }
        }
    }
}
