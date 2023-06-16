pipeline {
    agent any
    triggers {
        githubPush()
    }
    environment {
        IMAGE_NAME = 'tuana9a/dkhptd-api-gateway'
        BUILD_TAG_MONTHLY = sh (script: 'date +"%Y.%m"', returnStdout: true).trim()
        BUILD_TAG_DAILY = sh (script: 'date +"%Y.%m.%d"', returnStdout: true).trim()
    }
    stages {
        stage('Build') {
            steps {
                script {
                    // Build the Docker image
                    sh 'docker build . \
                    -t $IMAGE_NAME:$BUILD_TAG_DAILY \
                    -t $IMAGE_NAME:$BUILD_TAG_MONTHLY \
                    -t $IMAGE_NAME:latest'
                }
            }
        }
        stage('Push') {
            steps {
                script {
                    // Push the Docker image to a Docker registry
                    sh 'docker push $IMAGE_NAME:latest'
                    sh 'docker push $IMAGE_NAME:$BUILD_TAG_DAILY'
                    sh 'docker push $IMAGE_NAME:$BUILD_TAG_MONTHLY'
                }
            }
        }
    }
}