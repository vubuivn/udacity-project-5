#!/bin/bash
# install plugin
serverless plugin install -n serverless-iam-roles-per-function
serverless plugin install -n serverless-plugin-tracing
serverless plugin install -n serverless-webpack

# login to serverless
serverless login
serverless deploy
# https://www.serverless.com/framework/docs/providers/aws/guide/credentials
# serverless config credentials --provider aws --key $key --secret $secret


# install typescript before run "serverless" command
npm i -g typescript

# npm install 
# API ID: 8g1vlt34r6
npm install
npm audit fix --legacy-peer-deps
npm install --save-dev
npm run start
npm install cors --save
npm install aws-sdk

serverless plugin install -n serverless-reqvalidator-plugin
serverless plugin install -n serverless-aws-documentation

serverless remove 
serverless deploy