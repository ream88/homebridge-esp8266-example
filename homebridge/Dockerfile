FROM node:11-alpine AS builder

RUN apk update && apk add python g++ make
ADD package.json package-lock.json ./
RUN npm install

FROM node:11-alpine

WORKDIR /home

COPY --from=builder node_modules/ node_modules/
COPY homebridge-esp8266-plugin/ homebridge-esp8266-plugin/

CMD ["npx", "homebridge", "-U", "./config", "-P", "./homebridge-esp8266-plugin"]
