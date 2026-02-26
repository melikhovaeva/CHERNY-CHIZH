FROM node:25-alpine

WORKDIR /frontend-app

RUN npm install -g --force yarn

COPY package.json ./package.json

COPY . .

RUN yarn install

ARG APP_NAME=user-app

ENV APP_NAME=${APP_NAME}

RUN yarn workspace ${APP_NAME} build
