FROM node:18.18.2

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "build:css"]
CMD ["npm", "start"]