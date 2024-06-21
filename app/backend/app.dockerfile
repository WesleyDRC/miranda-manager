FROM node:22.3.0-alpine3.20
WORKDIR /app

EXPOSE 5000

COPY package*.json ./
RUN npm install --only=production
RUN npm install --save-dev ts-node-dev

COPY . .

CMD ["npm", "start"]
