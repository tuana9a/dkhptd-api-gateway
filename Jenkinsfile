pipeline {
    agent any
    environment {
        BIND = '0.0.0.0'
        CONTAINER_NAME = credentials('CONTAINER_NAME')
        CONTAINER_NETWORK = credentials('CONTAINER_NETWORK')
        CONTAINER_IP = credentials('CONTAINER_IP')
        SECRET = credentials('SECRET')
        JOB_ENCRYPTION_KEY = credentials('JOB_ENCRYPTION_KEY')
        AMQP_ENCRYPTION_KEY = credentials('AMQP_ENCRYPTION_KEY')
        RABBITMQ_CONNECTION_STRING = credentials('RABBITMQ_CONNECTION_STRING')
        MONGODB_CONNECTION_STRING = credentials('MONGODB_CONNECTION_STRING')
        DATABASE_NAME = credentials('DATABASE_NAME')
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
                    sh 'docker stop dkhptd-api-gateway || true'
                    sh 'docker rm dkhptd-api-gateway || true'
                    sh '''docker run -d \
                    --name $CONTAINER_NAME \
                    --net $CONTAINER_NETWORK \
                    --ip $CONTAINER_IP \
                    -e BIND=$BIND \
                    -e SECRET=$SECRET \
                    -e JOB_ENCRYPTION_KEY=$JOB_ENCRYPTION_KEY \
                    -e AMQP_ENCRYPTION_KEY=$AMQP_ENCRYPTION_KEY \
                    -e RABBITMQ_CONNECTION_STRING=$RABBITMQ_CONNECTION_STRING \
                    -e MONGODB_CONNECTION_STRING=$MONGODB_CONNECTION_STRING \
                    -e DATABASE_NAME=$DATABASE_NAME \
                    tuana9a/dkhptd-api-gateway'''
                }
            }
        }
    }
}