FROM node:latest

RUN apt-get update && apt-get upgrade

COPY package.json /home/package.json
COPY app.js /home/app.js
COPY app /home/app/
COPY config /home/config/
COPY libs /home/libs/
COPY logs /home/logs/
COPY public /home/public/
COPY data /home/data/

ENV NODE_ENV production
RUN cd /home && npm install --production

WORKDIR /home

EXPOSE 8080 4434
EXPOSE 4434

ENTRYPOINT ["node", "app.js"]