FROM node:latest

COPY package.json /home/package.json
COPY app.js /home/app.js
COPY api /home/api/
COPY app /home/app/
COPY classes /home/classes/
COPY config /home/config/
COPY libs /home/libs/
COPY logs /home/logs/
COPY public /home/public/
COPY data /home/data/

ENV NODE_ENV production
RUN apt-get update && apt-get upgrade && npm install -g pm2 && cd /home && npm install --production

WORKDIR /home

EXPOSE 8080 4434

ENTRYPOINT ["pm2", "start", "app", "-i", "$(nproc)", "--no-daemon"]