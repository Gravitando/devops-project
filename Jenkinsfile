pipeline {
    agent none

    stages {

        stage('Provision EC2') {
            agent { label 'built-in' }
            steps {
                dir('/var/lib/jenkins') {
                    sh 'terraform apply -auto-approve'
                }
            }
        }

        stage('Wait for node') {
            agent { label 'built-in' }
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitUntil {
                        script {
                            def node = Jenkins.instance.getNode('remote-builder')
                            node.toComputer()?.isOnline() == true
                        }
                    }
                }
            }
        }

        
        stage('Clone Repository') {
            agent { label 'remote-builder' }
            steps {
                git branch: 'main',
                    url: 'https://github.com/Gravitando/devops-project.git'
            }
        }

        stage('Build FrontEnd') {
            agent { label 'remote-builder' }
            steps {
                sh 'docker build -t akira66/devops-project-frontend:latest ./frontend'
            }
        }
        
        stage('Build BackEnd') {
            agent { label 'remote-builder' }
            steps {
                sh 'docker build -t akira66/devops-project-backend:latest ./backend'
            }
        }
                
        stage('Docker Login') {
            agent { label 'remote-builder' }
            environment {
                DOCKER_PASSWORD = credentials('docker-secret')
            }
            steps {
                sh 'echo $DOCKER_PASSWORD | docker login -u akira66 --password-stdin'
            }
        }
        
        stage('Push FrontEnd Image') {
            agent { label 'remote-builder' }
            steps {
                sh 'docker push akira66/devops-project-frontend:latest'
            }
        }
        
        stage('Push BackEnd Image') {
            agent { label 'remote-builder' }
            steps {
                sh 'docker push akira66/devops-project-backend:latest'
            }
        }
        
        stage('Docker Logout') {
            agent { label 'remote-builder' }
            steps {
                sh 'docker logout'
            }
        }

        stage('Destroying EC2') {
            agent { label 'built-in' }
            steps {
                dir('/var/lib/jenkins') {
                    sh 'terraform destroy -auto-approve'
                }
            }
        }
        stage('Deploy Containers') {
            agent { label 'built-in' }
            steps {
                sh '''
                  /var/lib/jenkins/ansible-setup/venv/bin/ansible-playbook \
                    -i /var/lib/jenkins/ansible-setup/inventory.ini \
                    /var/lib/jenkins/ansible-setup/redeploy.yaml
                '''
            }
        }

    }
}