FROM node:25-alpine AS frontend-builder

WORKDIR /app

COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./
RUN npm install -g pnpm@10.30.3 && pnpm install --frozen-lockfile

COPY frontend/ .

RUN pnpm run build


FROM nginx:1.27-alpine

COPY --from=frontend-builder /app/dist /usr/share/nginx/html
COPY infra/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
