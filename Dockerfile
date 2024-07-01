FROM node:20.11.0

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 4000

CMD [ "node", "index.js" ]