FROM node:20 AS builder

RUN mkdir -p /build
WORKDIR /build
COPY . .
RUN npm ci
RUN npm run build

FROM nginx:1-alpine

COPY --from=builder /build/dist /usr/share/nginx/html
