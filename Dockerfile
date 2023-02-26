FROM bitnami/node:16.18.0 AS build-stage
WORKDIR /app

COPY package*.json yarn.lock ./

# Protoze jsem si predtim zkopiroval do app lokalni package.json, tak mohu pustit RUN yarn install - RUN se pousti uz tam kde jsem
RUN yarn install
# to zkopiruje zbytek z lokalu do WORKDIR
COPY . .
# Make our shell scripts executable
RUN chmod +x ./install-server.sh
RUN ./install-server.sh

# Get build argument and set environment variable
ARG API_KEY
ARG FIREBASE_MEASUREMENT_ID
ARG FIREBASE_APP_ID
ARG FIREBASE_MESSAGING_SENDER_ID
ARG FIREBASE_STORAGE_BUCKET
ARG FIREBASE_PROJECT_ID
ARG FIREBASE_AUTH_DOMAIN
ARG FIREBASE_API_KEY
ARG SENTRY_DNS
ARG WEB_URL

ENV REACT_APP_API_KEY=$API_KEY
ENV REACT_APP_FIREBASE_MEASUREMENT_ID=$FIREBASE_MEASUREMENT_ID
ENV REACT_APP_FIREBASE_APP_ID=$FIREBASE_APP_ID
ENV REACT_APP_FIREBASE_MESSAGING_SENDER_ID=$FIREBASE_MESSAGING_SENDER_ID
ENV REACT_APP_FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET
ENV REACT_APP_FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
ENV REACT_APP_FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN
ENV REACT_APP_FIREBASE_API_KEY=$FIREBASE_API_KEY
ENV REACT_APP_SENTRY_DNS=$SENTRY_DNS
ENV REACT_APP_WEB_URL=$WEB_URL

RUN yarn build

################ Second stage

FROM bitnami/node:16.18.0

WORKDIR /app

# Static build
COPY --from=build-stage /app/build .
# Express files
COPY --from=build-stage /app/server/package.json .
COPY --from=build-stage /app/server/server.js .
COPY --from=build-stage /app/server/node_modules ./node_modules

# Create a non-root user
RUN useradd -r -u 1001 -g root nonroot && \
    chown -R nonroot /app
USER nonroot

# Default port exposure
EXPOSE 3000

CMD node server.js
