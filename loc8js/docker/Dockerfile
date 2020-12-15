FROM node:12-alpine as builder
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
COPY . /app
RUN npm run build
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]