pipeline {
    agent any
    triggers {
        githubPush()
    }
    environment {
        CONTAINER_NAME = credentials('CONTAINER_NAME')
        CONTAINER_NETWORK = credentials('CONTAINER_NETWORK')
        CONTAINER_IP = credentials('CONTAINER_IP')
        BUILD_TAG = sh (
            script: 'date +"%Y.%m"',
            returnStdout: true
        ).trim()
    }
    stages {
        stage('Build') {
            steps {
                script {
                    // Build the Docker image
                    sh 'docker build . \
                    -t tuana9a/dkhptd-api-gateway:$BUILD_TAG \
                    -t tuana9a/dkhptd-api-gateway:latest'
                }
            }
        }
        stage('Push') {
            steps {
                script {
                    // Push the Docker image to a Docker registry
                    docker.withRegistry('', 'docker-credentials') {
                        sh 'docker push tuana9a/dkhptd-api-gateway:$BUILD_TAG'
                        sh 'docker push tuana9a/dkhptd-api-gateway:latest'
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    // Deploy the Docker container
                    sh 'docker stop $CONTAINER_NAME || true'
                    sh 'docker rm $CONTAINER_NAME || true'
                    withCredentials([file(credentialsId: 'api-gateway-env', variable: 'envFile')]) {
                        // do something with the file, for instance 
                        sh '''docker run -d \
                            --name $CONTAINER_NAME \
                            --net $CONTAINER_NETWORK \
                            --ip $CONTAINER_IP \
                            --env-file $envFile \
                            tuana9a/dkhptd-api-gateway'''
                    }
                }
            }
        }
    }
}