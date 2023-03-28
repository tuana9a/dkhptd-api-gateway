pipeline {
    agent any
    triggers {
        githubPush()
    }
    environment {
        IMAGE_NAME = 'tuana9a/dkhptd-api-gateway'
        CONTAINER_NAME = credentials("CONTAINER_NAME_${env.BRANCH_NAME.toUpperCase()}")
        CONTAINER_NETWORK = credentials("CONTAINER_NETWORK_${env.BRANCH_NAME.toUpperCase()}")
        CONTAINER_IP = credentials("CONTAINER_IP_${env.BRANCH_NAME.toUpperCase()}")
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
                    docker.withRegistry('', 'docker-credentials') {
                        sh 'docker push $IMAGE_NAME:latest'
                        sh 'docker push $IMAGE_NAME:$BUILD_TAG_DAILY'
                        sh 'docker push $IMAGE_NAME:$BUILD_TAG_MONTHLY'
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
                    withCredentials([file(credentialsId: "env-file-${env.BRANCH_NAME}", variable: 'envFile')]) {
                        // do something with the file, for instance 
                        sh '''docker run -d \
                            --name $CONTAINER_NAME \
                            --net $CONTAINER_NETWORK \
                            --ip $CONTAINER_IP \
                            --env-file $envFile \
                            --restart unless-stopped \
                            $IMAGE_NAME'''
                    }
                }
            }
        }
    }
}