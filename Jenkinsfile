pipeline {
    // ใช้ agent any เพื่อรันบน Agent ที่พร้อมใช้งาน
    agent any

    stages {
        stage('1. SCM Checkout Test (Agent Any)') {
            steps { 
                echo "Starting SCM Checkout..."
                // ทดสอบ SCM Checkout
                checkout scm 
                
                // ทดสอบคำสั่ง Shell
                sh 'echo "Checkout successful. Current directory listing:"' 
                sh 'ls -al'
            }
        }
    }
}
