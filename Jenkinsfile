pipeline {
    agent any
    triggers {
        githubPush()
    }
    environment {
        IMAGE_NAME = 'tuana9a/dkhptd-api-gateway'
        BUILD_TAG_MONTHLY = sh (script: 'date +"%Y.%m"', returnStdout: true).trim()
        BUILD_TAG_DAILY = sh (script: 'date +"%Y.%m.%d"', returnStdout: true).trim()
        BUILD_TAG_SECONDLY = sh (script: 'date +"%Y.%m.%d.%H%M%S"', returnStdout: true).trim()
        TELEGRAM_BOT_TOKEN = credentials("telegram-bot-token")
        TELEGRAM_CHAT_ID = credentials("telegram-chat-id")
    }
    stages {
        stage('Build') {
            steps {
                script {
                    // Build the Docker image
                    sh 'docker build --pull . \
                    -t $IMAGE_NAME:$BUILD_TAG_SECONDLY \
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
                    sh 'docker push $IMAGE_NAME:$BUILD_TAG_SECONDLY'
                    sh 'docker push $IMAGE_NAME:$BUILD_TAG_DAILY'
                    sh 'docker push $IMAGE_NAME:$BUILD_TAG_MONTHLY'
                }
            }
        }
        stage('Update manifest version') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'gitlab-username-password-tuana9a', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                    script {
                        env.MANIFEST_REPO_NAME = 'platform'
                        env.MANIFEST_REPO_URL = sh (script: 'echo "https://$GIT_USERNAME:$GIT_PASSWORD@gitlab.com/tuana9a/platform.git"', returnStdout: true).trim()
                        env.MR_BRANCH_NAME = "bump-dkhptd-api-gateway-version-$BUILD_TAG_SECONDLY"
                        sh 'if [ -d $MANIFEST_REPO_NAME ]; then rm -r $MANIFEST_REPO_NAME; fi'
                        sh 'git clone $MANIFEST_REPO_URL'
                        sh '''
                        cd $MANIFEST_REPO_NAME
                        git checkout -b "$MR_BRANCH_NAME"
                        sed -i "s|image: tuana9a/dkhptd-api-gateway:.*|image: tuana9a/dkhptd-api-gateway:$BUILD_TAG_SECONDLY|" deploy/dkhptd/k8s/deployments.yaml
                        git add .
                        git commit -m "Bump dkhptd-api-gateway version to $BUILD_TAG_SECONDLY"
                        git push $MANIFEST_REPO_URL --set-upstream "$MR_BRANCH_NAME" -o merge_request.create -o merge_request.target=main -o merge_request.remove_source_branch
                        '''
                        sh 'if [ -d $MANIFEST_REPO_NAME ]; then rm -r $MANIFEST_REPO_NAME; fi'
                    }
                }
            }
        }
    }
    post {
        always {
            script {
                def msg = "${currentBuild.result} ${env.BUILD_URL}"
                sh "echo \"${msg}\""
                sh 'curl -X POST https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage -d "chat_id=$TELEGRAM_CHAT_ID" -d "text=' + msg + '"'
            }
        }
    }
}
