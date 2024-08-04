# BUILD AND PREVIEW 
FROM node:22-alpine
WORKDIR /build
COPY . ./
RUN node -v && npm -v && npm install -g pnpm && pnpm -v
RUN pnpm install
CMD [ "pnpm", "dev", "--host" ]