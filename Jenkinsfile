pipeline {
    agent {
        kubernetes {
            yaml """
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
    - name: buildkit-cache
      mountPath: /var/lib/buildkit
    - name: workspace-volume 
      mountPath: /home/jenkins/agent/workspace 
  
  volumes:
  - name: buildkit-cache
    emptyDir: {}
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
                    // ทดสอบการเชื่อมต่อ Shell โดยการรันคำสั่งที่ซับซ้อนระดับกลาง
                    sh 'echo "Starting SCM Checkout on BuildKit Agent..."'
                    checkout scm 
                    sh 'ls -al' // ควรแสดงไฟล์ที่ checkout มา
                }
            }
        }
    }
}
