pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: buildkit-agent
    image: moby/buildkit:rootless
    workingDir: /home/jenkins/agent/workspace/${JOB_NAME}
    command: ["/bin/sh", "-c", "cat"]
    tty: true
    securityContext:
      runAsUser: 1000
      runAsGroup: 1000
    volumeMounts:
    - name: buildkit-cache
      mountPath: /var/lib/buildkit
    # *** FIX 1: เพิ่ม Workspace Volume Mount ***
    - name: workspace-volume 
      mountPath: /home/jenkins/agent/workspace 
  volumes:
  - name: buildkit-cache
    emptyDir: {}
  # *** FIX 1: เพิ่ม Workspace Volume ***
  - name: workspace-volume
    emptyDir: {}
"""
        }
    }

    environment {
        CONTAINER_NAME = "buildkit-agent"
        DOCKER_IMAGE = "iamamply/ci-cd-app"
        CACHE_REPO = "iamamply/ci-cd-app-cache"
    }

    stages {
        stage('1. Checkout') {
            steps {
                container(env.CONTAINER_NAME) {
                    checkout scm
                    sh 'ls -al'
                }
            }
        }

        stage('2. Build & Push') {
            steps {
                container(env.CONTAINER_NAME) {
                    script {
                        env.IMAGE_TAG = sh(script: 'date +%Y%m%d%H%M%S', returnStdout: true).trim()
                        def fullImage = "${DOCKER_IMAGE}:${IMAGE_TAG}"
                        def cacheRef = "${CACHE_REPO}:latest"

                        withCredentials([usernamePassword(credentialsId: 'docker-hub-credential', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USER')]) {
                            sh """
                                # 1. สร้าง config.json สำหรับ BuildKit Daemonless
                                mkdir -p ~/.docker
                                echo "{\"auths\":{\"https://index.docker.io/v1/\":{\"username\":\"$DOCKER_USER\",\"password\":\"$DOCKER_PASSWORD\"}}}" > ~/.docker/config.json

                                # 2. Build และ Push
                                buildctl-daemonless.sh build \\
                                  --frontend=dockerfile.v0 \\
                                  --local context=. \\
                                  --local dockerfile=Dockerfile \\  # *** FIX 2: เปลี่ยน . เป็น Dockerfile ***
                                  --progress=plain \\
                                  --output type=image,name=${fullImage},push=true \\
                                  --import-cache type=registry,ref=${cacheRef} \\
                                  --export-cache type=registry,ref=${cacheRef}
                            """
                        }
                    }
                }
            }
        }

        stage('3. Deploy') {
            steps {
                container(env.CONTAINER_NAME) {
                    sh """
                        kubectl set image deployment/ci-cd-app-deployment ci-cd-app-container=${DOCKER_IMAGE}:${IMAGE_TAG}
                        kubectl rollout status deployment/ci-cd-app-deployment --timeout=120s
                    """
                }
            }
        }
    }
}
