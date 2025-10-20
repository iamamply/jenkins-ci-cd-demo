pipeline {
    agent any
//     agent {
//         kubernetes {
//             // โค้ด YAML ที่มี BuildKit Agent และ Volume ที่ถูกต้อง
//             yaml '''
// apiVersion: v1
// kind: Pod
// spec:
//   containers:
//   - name: buildkit-agent
//     image: "moby/buildkit:rootless" 
//     workingDir: /home/jenkins/agent/workspace/${JOB_NAME} 
//     command: ["/bin/sh", "-c", "cat"]
//     tty: true
//     securityContext:
//       runAsUser: 1000 
//       runAsGroup: 1000
//     volumeMounts:
//     - name: buildkit-cache
//       mountPath: /var/lib/buildkit
//     - name: workspace-volume 
//       mountPath: /home/jenkins/agent/workspace 
  
//   volumes:
//   - name: buildkit-cache
//     emptyDir: {}
//   - name: workspace-volume
//     emptyDir: {}
// '''
//         }
//     }

    environment {
        CONTAINER_NAME = "buildkit-agent" 
    }

    stages {
        stage('1. Agent Connectivity Test') {
            steps { 
                container(env.CONTAINER_NAME) {
                    sh 'echo "Agent Pod (BuildKit image) is connected." '
                    // sh 'id' // ควรเป็น uid=1000
                }
            }
        }
        
        stage('2. SCM Checkout Test') {
            steps {
                container(env.CONTAINER_NAME) {
                    // checkout scm 
                    // sh 'ls -al' // ต้องเห็น Dockerfile
                }
            }
        }
    }
}
