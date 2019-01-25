# build stage
FROM node:9.11.1-alpine as build-stage
WORKDIR /app
RUN apk add --no-cache --virtual .gyp \
        bash \
        python \
        make \
        g++
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:1.13.12-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
RUN rm -rf /etc/nginx/conf.d/*
COPY nginx/default.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]