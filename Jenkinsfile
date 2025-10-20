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
        CACHE_REPO = "iamamply/ci-cd-app-cache"
    }

    stages {
        stage('1. Checkout Code') {
            steps { container(env.CONTAINER_NAME) { checkout scm } }
        }
        
        stage('2. Build & Push Docker Image (BuildKit)') {
            steps {
                container(env.CONTAINER_NAME) {
                    script {
                        env.IMAGE_TAG = sh(returnStdout: true, script: 'date +%Y%m%d%H%M%S').trim()
                        def FULL_IMAGE = "${env.DOCKER_IMAGE}:${env.IMAGE_TAG}"

                        withCredentials([usernamePassword(credentialsId: 'docker-hub-credential', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USER')]) {
                        sh """
                            echo "Starting BuildKit build for: ${FULL_IMAGE}"

                            /usr/bin/buildctl-daemonless.sh build \\
                                --frontend=dockerfile.v0 \\
                                --local context=\$WORKSPACE \\
                                --local dockerfile=\$WORKSPACE/Dockerfile \\
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
                    sh "kubectl set image deployment/ci-cd-app-deployment ci-cd-app-container=${DOCKER_IMAGE}:${IMAGE_TAG}"
                    sh "kubectl rollout status deployment/ci-cd-app-deployment --timeout=120s"
                }
            }
        }
    }
}
