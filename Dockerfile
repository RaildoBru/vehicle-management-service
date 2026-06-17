FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000 3001 3002

USER node

CMD ["npm", "run", "dev"]