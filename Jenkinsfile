pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'your_dockerhub_username'
        DOCKER_HUB_PASS = credentials('dockerhub-cred')
    }

    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timeout(time: 15, unit: 'MINUTES')
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/your-username/microservices-demo.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh 'docker build -t $DOCKER_HUB_USER/frontend:latest ./frontend'
                    sh 'docker build -t $DOCKER_HUB_USER/api-node:latest ./api-node'
                    sh 'docker build -t $DOCKER_HUB_USER/api-python:latest ./api-python'
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                script {
                    sh 'echo $DOCKER_HUB_PASS | docker login -u $DOCKER_HUB_USER --password-stdin'
                    sh 'docker push $DOCKER_HUB_USER/frontend:latest'
                    sh 'docker push $DOCKER_HUB_USER/api-node:latest'
                    sh 'docker push $DOCKER_HUB_USER/api-python:latest'
                }
            }
        }

        stage('Notify') {
            steps {
                echo 'Docker images pushed successfully. Deploy using kubectl on local system.'
            }
        }
    }
}
