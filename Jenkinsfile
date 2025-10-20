pipeline {
    agent {
        kubernetes {
            // *** เพิ่ม BuildKit Agent Template ***
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: buildkit-agent
    image: "moby/buildkit:rootless" 
    workingDir: /home/jenkins/agent/workspace/${JOB_NAME} 
    command: ["/bin/sh", "-c", "cat"]
    tty: true
    securityContext:
      runAsUser: 1000 
      runAsGroup: 1000
    volumeMounts:
    - name: buildkit-cache-volume
      mountPath: /var/lib/buildkit
    - name: workspace-volume 
      mountPath: /home/jenkins/agent/workspace 
  
  volumes:
  - name: buildkit-cache-volume
    emptyDir: {}
  - name: workspace-volume
    emptyDir: {}
'''
        }
    }

    environment {
        // อัปเดตชื่อ Container เป็น BuildKit
        CONTAINER_NAME = "buildkit-agent" 
        DOCKER_IMAGE = "iamamply/ci-cd-app" // เพิ่มกลับมา แต่ยังไม่ได้ใช้
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
        
        stage('2. BuildKit Environment Test') {
            steps {
                container(env.CONTAINER_NAME) {
                    // *** ทดสอบว่า BuildKit binary มีอยู่และ Working Directory ถูกต้อง ***
                    sh 'echo "Current Working Directory is:"'
                    sh 'pwd' 
                    sh 'echo "Running BuildKit binary check..."'
                    sh '/usr/bin/buildctl-daemonless.sh --version'
                    sh 'echo "Current User ID is:"'
                    sh 'id'
                }
            }
        }
    }
}
