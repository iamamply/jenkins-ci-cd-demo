pipeline {
    agent {
        kubernetes {
            // ใช้ Image พื้นฐานที่มี shell (เช่น /bin/sh) และเครื่องมือพื้นฐาน
            // เรากำลังทดสอบ Agent Pod โดยไม่ใช้ BuildKit/Rootless Environment
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: test-agent
    image: "alpine/git:latest" 
    command: ["/bin/sh", "-c", "cat"]
    tty: true
'''
        }
    }

    environment {
        CONTAINER_NAME = "test-agent" 
    }

    stages {
        stage('1. Checkout Code') {
            steps { 
                container(env.CONTAINER_NAME) {
                    sh 'echo "Starting SCM Checkout..."'
                    checkout scm 
                    sh 'ls -al' // ตรวจสอบว่าไฟล์ถูก Checkout มาจริง
                }
            }
        }
        
        stage('2. Basic Shell Test') {
            steps {
                container(env.CONTAINER_NAME) {
                    sh 'echo "Agent Container is running simple shell commands."'
                    sh 'apk add --no-cache curl' // ลองติดตั้ง Package เพื่อยืนยันสิทธิ์
                    sh 'env' // ดู Environment Variables ทั้งหมด
                }
            }
        }
    }
}
