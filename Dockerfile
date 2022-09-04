# syntax=docker/dockerfile:1
FROM node:16.13.2
WORKDIR /usr/squidbot
COPY package.json .
RUN npm install && npm install typescript -g
COPY . .
RUN tsc

EXPOSE 8080
CMD [ "node", "./build/bot.js", DISCORD_TOKEN, DISCORD_CLIENT_ID ]