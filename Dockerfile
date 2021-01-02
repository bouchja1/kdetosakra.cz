# building the image
FROM mhart/alpine-node:10.19.0 AS build-stage

MAINTAINER Jan Bouchner <jan.bouchner@gmail.com>

WORKDIR /usr/src/app

COPY package*.json ./

# Install all the dependencies, this will be cached until we change the package.json file
RUN npm install

# copy our source code
COPY . .

# build the react app
RUN npm run build

# DEVSERVER SETUP =
# https://create-react-app.dev/docs/deployment
# https://dev.to/zivka51084113/dockerize-create-react-app-in-3-minutes-3om3

FROM nginx:1.16.1-alpine
WORKDIR /var/www
COPY --from=build-stage /usr/src/app/build .
# Copy the default nginx.conf
COPY --from=build-stage /usr/src/app/nginx.conf /etc/nginx/nginx.conf
# Copy .env file and shell script to container
COPY --from=build-stage /usr/src/app/env-config.sh .
COPY --from=build-stage /usr/src/app/.env .

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x env-config.sh

EXPOSE 80

# Start Nginx server
CMD ["/bin/bash", "-c", "/var/www/env-config.sh && nginx -g \"daemon off;\""]

