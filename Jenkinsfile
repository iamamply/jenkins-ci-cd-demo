pipeline {
    agent {
        kubernetes {
            // โค้ด YAML ที่มี BuildKit Agent และ Volume ที่ถูกต้อง
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
    - name: buildkit-cache
      mountPath: /var/lib/buildkit
    - name: workspace-volume 
      mountPath: /home/jenkins/agent/workspace 
  
  volumes:
  - name: buildkit-cache
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
            // *** 4. ทำ Checkout ใน Container ที่เป็น BuildKit (เพื่อให้ User 1000 เป็นเจ้าของไฟล์) ***
            steps { container(env.CONTAINER_NAME) { checkout scm } }
        }

        // stage('2. Build & Push Docker Image (BuildKit)') {
        //     steps {
        //         container(env.CONTAINER_NAME) {
        //     }
        // }
    }
}
