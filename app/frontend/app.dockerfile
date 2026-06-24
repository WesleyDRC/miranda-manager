FROM node:22.3.0-alpine3.20

WORKDIR /app

COPY package*.json .

RUN npm install --legacy-peer-deps

COPY . .

CMD [ "npm", "start"]