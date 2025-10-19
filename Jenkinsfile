pipeline {
    agent any
    environment {
        // !!! 1. แก้ไขตรงนี้เป็น Username Docker Hub ของคุณ !!!
        DOCKER_IMAGE = "iamamply@hotmail.com/ci-cd-app" 
    }

    stages {
        stage('1. Checkout Code') {
            steps { checkout scm }
        }
        
        stage('2. Build Docker Image') {
            steps {
                script {
                    // กำหนด Tag เป็นเวลาปัจจุบัน (ใช้เป็นเวอร์ชัน Image)
                    env.IMAGE_TAG = sh(returnStdout: true, script: 'date +%Y%m%d%H%M%S').trim()
                    sh "docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} ."
                }
            }
        }

        stage('3. Push Image to Docker Hub') {
            steps {
                // ใช้ ID 'docker-hub-credential' ที่เราสร้างไว้ใน Jenkins
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credential', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USER')]) {
                    sh "echo \$DOCKER_PASSWORD | docker login -u \$DOCKER_USER --password-stdin"
                    sh "docker push ${DOCKER_IMAGE}:${IMAGE_TAG}"
                }
            }
        }
        
        stage('4. Deploy to Kubernetes') {
            steps {
                // 2. สั่ง K8s ดึง Image ใหม่: นี่คือ Continuous Delivery (CD)
                sh "kubectl set image deployment/ci-cd-app-deployment ci-cd-app-container=${DOCKER_IMAGE}:${IMAGE_TAG}"
                
                // 3. รอให้ K8s อัปเดต Deployment เสร็จสมบูรณ์
                sh "kubectl rollout status deployment/ci-cd-app-deployment --timeout=120s"
            }
        }
    }
}