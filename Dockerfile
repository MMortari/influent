FROM node:16-alpine

WORKDIR /app

COPY ./package.json .

RUN yarn

COPY . .

RUN yarn prisma generate

RUN yarn tsc

EXPOSE 3333

CMD [ "node", "./dist/server.js" ]