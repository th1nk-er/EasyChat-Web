# BUILD
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN node -v && npm -v && npm install -g pnpm && pnpm -v && pnpm install
COPY . .
RUN pnpm run build
# Deploy
FROM nginx:alpine
RUN apk add --no-cache gettext
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf.template /etc/nginx/templates/default.conf.template
ENV BACKEND_HOST=localhost
ENV BACKEND_PORT=8080
EXPOSE 80