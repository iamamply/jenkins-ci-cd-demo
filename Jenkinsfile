pipeline {
    agent {
        kubernetes {
            // ใช้ BuildKit YAML Template ที่ถูกต้อง
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
        stage('Test Plugin Shell Execution') {
            steps { 
                // *** จุดทดสอบ: การเรียกใช้ container() และ sh '...' ที่ทำให้เกิด Bug ***
                container(env.CONTAINER_NAME) {
                    sh 'echo "This should fail if the plugin bug is present."' 
                }
            }
        }
    }
}
