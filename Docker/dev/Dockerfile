FROM node:trixie-slim

RUN apt-get update && apt-get install -y procps

WORKDIR /app

COPY package*.json ./

COPY . .

COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

RUN npm install

EXPOSE 3000

ENTRYPOINT [ "wait-for-it.sh", "db:5432", "--" ]
CMD [ "npm", "run", "start:dev" ]