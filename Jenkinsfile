pipeline {
    agent {
        kubernetes {
            cloud 'kubernetes'
            // ใช้ Label เพื่อให้ K8s สร้าง Pod Agent ใหม่
            label 'kaniko-builder' 

            // A. เพิ่ม Kaniko Container เข้าไปใน Pod Agent
            containerTemplate {
                name 'kaniko'
                // ใช้ image Kaniko ที่มีเครื่องมือ Build
                image 'gcr.io/kaniko-project/executor:v1.16.0-debug' 
                command 'cat' // คำสั่งพื้นฐานให้คอนเทนเนอร์รันอยู่
                tty true
                // B. Mount Volume สำหรับไฟล์ .docker/config.json
                volumeMounts {
                    mountPath '/kaniko/.docker'
                    name 'kaniko-secret-volume'
                }
            }

            // C. เพิ่ม Volume ที่อ้างถึง Secret 'regcred' ที่คุณสร้างเมื่อสักครู่
            volumes {
                secretVolume {
                    secretName 'regcred' // *** ชื่อ Secret ที่คุณสร้าง: regcred ***
                    mountPath '/kaniko/.docker'
                    defaultMode 0400
                    volumeName 'kaniko-secret-volume'
                }
                // D. (Optional) เพิ่ม Volume สำหรับ kubectl หาก image Kaniko ไม่มี
                configMapVolume {
                    configMapName 'kubectl-config' // สมมติว่ามี ConfigMap ที่มี kubectl
                    mountPath '/usr/local/bin/kubectl' // Mount ไบนารี kubectl เข้าไป
                    volumeName 'kubectl-bin'
                }
            }
        }
    }

    environment {
        // ใช้ ENV เดิม
        DOCKER_IMAGE = "iamamply@hotmail.com/ci-cd-app" 
    }

    stages {
        stage('1. Checkout Code') {
            steps { checkout scm }
        }
        
        stage('2. Build and Push Docker Image (Kaniko)') {
            steps {
                container('kaniko') { // E. สั่งให้รันในคอนเทนเนอร์ 'kaniko'
                    script {
                        // กำหนด Tag เป็นเวลาปัจจุบัน
                        env.IMAGE_TAG = sh(returnStdout: true, script: 'date +%Y%m%d%H%M%S').trim()
                        
                        // F. คำสั่ง Kaniko Build & Push
                        // --destination จะทำการ Push Image ขึ้น Registry ทันที
                        sh """
                            /kaniko/executor \
                            --context=dir://$(pwd) \
                            --dockerfile=Dockerfile \
                            --destination=${DOCKER_IMAGE}:${IMAGE_TAG} \
                            --cleanup \
                            --cache=true
                        """
                    }
                }
            }
        }
        
        // Stage 3. ถูกรวมเข้ากับ Stage 2 แล้ว
        
        stage('4. Deploy to Kubernetes') {
            steps {
                // G. รัน kubectl ในคอนเทนเนอร์ที่มีไบนารี kubectl
                // หาก image Kaniko ไม่มี kubectl ให้เปลี่ยน 'kaniko' เป็นคอนเทนเนอร์อื่นที่มี (เช่น 'kubectl' หรือ 'jnlp' ถ้าติดตั้งแล้ว)
                container('kaniko') { 
                    sh '''
                        kubectl set image deployment/ci-cd-app-deployment ci-cd-app-container=${DOCKER_IMAGE}:${IMAGE_TAG}
                        kubectl rollout status deployment/ci-cd-app-deployment --timeout=120s
                    '''
                }
            }
        }
    }
}
