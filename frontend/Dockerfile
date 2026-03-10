FROM node:25-alpine

WORKDIR /frontend-app

COPY package.json ./package.json
COPY pnpm-lock.yaml ./pnpm-lock.yaml
COPY pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN npm install -g pnpm@10.30.3 && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build
