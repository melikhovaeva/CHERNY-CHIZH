FROM node:25-alpine

WORKDIR /frontend-app

COPY package.json ./package.json
COPY pnpm-lock.yaml ./pnpm-lock.yaml
COPY pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY packages/common/package.json ./packages/common/package.json
COPY packages/user-app/package.json ./packages/user-app/package.json
COPY packages/admin-app/package.json ./packages/admin-app/package.json

RUN npm install -g pnpm@10.30.3 && pnpm install --frozen-lockfile

COPY . .

ARG APP_NAME=user-app

ENV APP_NAME=${APP_NAME}

RUN pnpm --filter ${APP_NAME} run build
