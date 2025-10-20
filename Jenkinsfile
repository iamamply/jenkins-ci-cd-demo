pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: buildkit-agent
    image: "moby/buildkit:rootless" 
    # *** 1. กำหนด Working Directory ให้ตรงกับที่ Jenkins Checkout โค้ด ***
    workingDir: /home/jenkins/agent/workspace/${JOB_NAME} 
    command: ["/bin/sh", "-c", "cat"]
    tty: true
    securityContext:
      runAsUser: 1000 
      runAsGroup: 1000
    volumeMounts:
    - name: buildkit-cache-volume
      mountPath: /var/lib/buildkit
    # *** 2. เพิ่ม Volume สำหรับ Working Directory (สำคัญมาก) ***
    - name: workspace-volume 
      mountPath: /home/jenkins/agent/workspace 
  
  # *** 3. กำหนด Volume ที่ถูกแชร์ ***
  volumes:
  - name: buildkit-cache-volume
    emptyDir: {}
  - name: workspace-volume
    emptyDir: {}
'''
        }
    }

    environment {
        CONTAINER_NAME = "buildkit-agent" 
        DOCKER_IMAGE = "iamamply/ci-cd-app" 
        CACHE_REPO = "iamamply/ci-cd-app-cache" 
    }

    stages {
        stage('1. Checkout Code') {
            // *** 4. ทำ Checkout ใน Container ที่เป็น BuildKit (เพื่อให้ User 1000 เป็นเจ้าของไฟล์) ***
            steps { container(env.CONTAINER_NAME) { checkout scm } }
        }
        
        stage('2. Build & Push Docker Image (BuildKit)') {
            steps {
                container(env.CONTAINER_NAME) {
                    script {
                        env.IMAGE_TAG = sh(returnStdout: true, script: 'date +%Y%m%d%H%M%S').trim()
                        def FULL_IMAGE = "${env.DOCKER_IMAGE}:${env.IMAGE_TAG}"

                        // 5. แก้ไข Insecure Warning โดยใช้ triple single quotes (ไม่จำเป็นต้องแก้ไข แต่ช่วยลด warning)
                        withCredentials([usernamePassword(credentialsId: 'docker-hub-credential', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USER')]) {
                            sh '''
                            mkdir -p /home/user/.docker
                            
                            # 6. ใช้ . (dot) และ Dockerfile ตามปกติ เพราะ Working Directory ถูกต้องแล้ว
                            /usr/bin/buildctl-daemonless.sh build \\
                                --frontend=dockerfile.v0 \\
                                --local context=. \\ 
                                --local dockerfile=Dockerfile \\
                                --progress=plain \\
                                \\
                                --output type=image,name=''' + FULL_IMAGE + ''',push=true \\
                                \\
                                --import-cache type=registry,ref=''' + env.CACHE_REPO + ''':latest \\
                                --export-cache type=registry,ref=''' + env.CACHE_REPO + ''':latest
                            '''
                        }
                    }
                }
            }
        }
        
        stage('3. Deploy to Kubernetes') {
            // หากไม่มี kubectl ต้องเปลี่ยน Container/Image ที่นี่
            steps { container(env.CONTAINER_NAME) { 
                sh "kubectl set image deployment/ci-cd-app-deployment ci-cd-app-container=${DOCKER_IMAGE}:${IMAGE_TAG}"
                sh "kubectl rollout status deployment/ci-cd-app-deployment --timeout=120s"
            } }
        }
    }
}
