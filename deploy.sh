#!/bin/bash

ENV=$1
BRANCH_NAME=${2}
HOME_PATH=/home/jenkins/velynk_deployment

if [ -z $ENV ]
then
    echo "Please provide environment eg: staging/production/integration"
    exit 0
fi

git stash 
git fetch -a

if [ $ENV == "production" ]
then
    git checkout master
    git pull
else
    git fetch -a
    git checkout $BRANCH_NAME
    git pull
    git reset --hard origin/$BRANCH_NAME
fi

echo Deploying to $ENV with branch $BRANCH_NAME
source $HOME_PATH/.awscreds
source ~/.nvm/nvm.sh

source $HOME_PATH/.$ENV

# Updating node version, as react uses latest version
nvm use 18

echo $.$ENV

yarn install

rm -rf dist
yarn build:prod

nvm use 16

aws s3 rm s3://$FRONTEND_BUCKET/ --recursive
aws s3 cp dist/ s3://$FRONTEND_BUCKET/ --recursive

INVALIDATION=`aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_ID \
    --paths "/*"` 
