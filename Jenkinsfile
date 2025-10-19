pipeline {
    agent {
        kubernetes {
            cloud 'kubernetes'
            // ใช้ Label เพื่อให้ K8s สร้าง Pod Agent ใหม่
            label 'kaniko-builder' 
            
            // ใช้ YAML เพื่อกำหนดทั้ง Container (kaniko) และ Volume (regcred Secret)
            // ซึ่งเป็นวิธีที่ Jenkins Kubernetes Plugin ยอมรับ
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:v1.16.0-debug
    command: ["/bin/sh", "-c", "cat"]
    tty: true
    volumeMounts:
    - name: kaniko-secret-volume
      mountPath: /kaniko/.docker
  volumes:
  - name: kaniko-secret-volume
    secret:
      secretName: regcred  # ต้องตรงกับชื่อ Secret ที่คุณสร้างไว้
      defaultMode: 256  # 0400
'''
        }
    }

    environment {
        // !!! ตรวจสอบว่า DOCKER_IMAGE ถูกต้อง !!!
        DOCKER_IMAGE = "iamamply/ci-cd-app" 
    }

    stages {
        stage('1. Checkout Code') {
            steps { checkout scm }
        }
        
        stage('2. Build and Push Docker Image (Kaniko)') {
            steps {
                container('kaniko') { // สั่งให้รันในคอนเทนเนอร์ 'kaniko'
                    script {
                        // กำหนด Tag เป็นเวลาปัจจุบัน
                        env.IMAGE_TAG = sh(returnStdout: true, script: 'date +%Y%m%d%H%M%S').trim()
                        
                        // *** คำสั่ง Kaniko Build & Push ***
                        // ใช้ Triple Single Quotes (''') และการเชื่อมสตริง (+) เพื่อเลี่ยง Groovy Error
                        sh '''
                            /kaniko/executor \
                            --context=dir://$(pwd) \
                            --dockerfile=Dockerfile \
                            --destination=''' + DOCKER_IMAGE + ''':''' + IMAGE_TAG + ''' \
                            --cleanup \
                            --cache=true
                        '''
                    }
                }
            }
        }
        
        stage('4. Deploy to Kubernetes') {
            steps {
                // *** ข้อสันนิษฐาน: Image Kaniko มี kubectl ติดตั้งอยู่ ***
                // ถ้าไม่มี จะเกิด error 'kubectl: not found'
                container('kaniko') { 
                    // ใช้ Triple Single Quotes (''') เพื่อป้องกัน Groovy Error (Error ที่คุณเจอ)
                    // Groovy จะตีความตัวแปร Environment ${} ภายใน ''' '''
                    sh '''
                        kubectl set image deployment/ci-cd-app-deployment ci-cd-app-container=${DOCKER_IMAGE}:${IMAGE_TAG}
                        kubectl rollout status deployment/ci-cd-app-deployment --timeout=120s
                    '''
                }
            }
        }
    }
}
