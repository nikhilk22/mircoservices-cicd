pipeline {
  agent any

  environment{
    REGISTRY = "docker.io"
    DOCKERHUB_USER = credentials('dockerhub-username')
    DOCKERHUB_PASS = credentials('dockerhub-password')
    KUBECONFIG_CRED = credentials('kubeconfig')
    DOCKERHUB_NS = "DOCKERHUB_USERNAME" // change this
  }
  
  options { timestamps() }

  stages{
    stage ('checkout'){
      steps{ checkout scm}
    }

    stage ('build and unit test'){
      parallel{
        stage('frontend'){
          agent { docker { image 'node:20-alpine' } }
          steps {
            dir('frontend') {
              sh 'npm ci || npm install'
              sh 'npm test'
            }
          }
        }
        stage('spi-node'){
          agent { docker { image 'node:20-alpine' } }
          steps {
            dir('api-node') {
              sh 'npm ci || npm install'
              sh 'npm test'
            }
          }
        }
        stage('api-python') {
          agent { docker { image 'python:3.12-slim' } }
          steps {
            dir('api-python') {
              sh 'pip install -r requirements.txt'
              sh 'python -m pytest || python tests/test_api.py'
            }
          }
        }
      }
    }
    stage('Docker Build & Push') {
      steps {
        sh 'echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin'
        sh 'docker build -t $REGISTRY/$DOCKERHUB_NS/frontend:latest ./frontend'
        sh 'docker build -t $REGISTRY/$DOCKERHUB_NS/api-node:latest ./api-node'
        sh 'docker build -t $REGISTRY/$DOCKERHUB_NS/api-python:latest ./api-python'
        sh 'docker push $REGISTRY/$DOCKERHUB_NS/frontend:latest'
        sh 'docker push $REGISTRY/$DOCKERHUB_NS/api-node:latest'
        sh 'docker push $REGISTRY/$DOCKERHUB_NS/api-python:latest'
      }
    }
    stage('Deploy to Kubernetes') {
      steps {
        withEnv(["KUBECONFIG=${env.WORKSPACE}/.kubeconfig"]) {
          sh 'echo "$KUBECONFIG_CRED" > .kubeconfig'
          sh 'kubectl apply -f k8s/namespace.yaml'
          sh 'sed -i "s/DOCKERHUB_USERNAME/$DOCKERHUB_NS/g" k8s/*.yaml'
          sh 'kubectl apply -f k8s/'
          sh 'kubectl -n demo rollout status deploy/frontend'
          sh 'kubectl -n demo get svc,deploy,pods -o wide'
        }
      }
    }
  }
}
