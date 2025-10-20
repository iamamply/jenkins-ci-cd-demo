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
            steps {
                echo '1. Checkout Code'
            }
        }
    }
}
