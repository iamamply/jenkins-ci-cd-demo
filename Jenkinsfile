pipeline {
    agent {
        kubernetes {
            // *** ใช้ # สำหรับ comment ใน YAML เท่านั้น และคงส่วนที่จำเป็นไว้ ***
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: buildkit-agent
    image: "alpine/git:latest" 
    workingDir: /home/jenkins/agent/workspace/${JOB_NAME}
    command: ["/bin/sh", "-c", "cat"]
    tty: true
    # เราตัด securityContext ออกเพื่อทดสอบการเชื่อมต่อ
    volumeMounts:
    - name: workspace-volume 
      mountPath: /home/jenkins/agent/workspace 
  
  volumes:
  - name: workspace-volume
    emptyDir: {}
"""
        }
    }

    environment {
        CONTAINER_NAME = "buildkit-agent" 
    }

    stages {
        stage('1. Checkout & Shell Test') {
            steps { 
                container(env.CONTAINER_NAME) {
                    sh 'echo "Starting SCM Checkout on ALPINE Agent..."'
                    checkout scm 
                    sh 'ls -al'
                }
            }
        }
    }
}
