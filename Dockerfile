FROM node:23


RUN apt-get update && apt-get install -y procps && \
 rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install --frozen-lockfile

COPY . .

# copy wait for it script 
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh"]


# make a sperate entrypoint.sh then inlcude db and redis in it.