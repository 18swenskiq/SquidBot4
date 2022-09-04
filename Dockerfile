# syntax=docker/dockerfile:1
FROM node:16.13.2
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN npm config set unsafe-perm true
RUN npm install -g typescript
RUN npm install -g ts-node
USER node
COPY --chown=node:node . .
RUN npm install
RUN npm run compile

# STAGE 2
FROM node:16.13.2
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm install --production
COPY --from=builder /home/node/app/output ./build

COPY --chown=node:node .env .
COPY --chown=node:node  /config ./config
COPY --chown=node:node  /public ./public


CMD [ "node", "build/deploy-commands.js", DISCORD_TOKEN, DISCORD_CLIENT_ID ]
CMD [ "node", "build/bot.js", DISCORD_TOKEN, DISCORD_CLIENT_ID ]