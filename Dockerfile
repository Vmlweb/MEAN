FROM node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN groupadd -r node \
&&  useradd -r -m -g node node

COPY . /usr/src/app/
RUN chown -R node:node /usr/src/app

USER node
RUN npm install \
 && grunt build # required for staging

ENV NODE_ENV development # production for staging
CMD [ "npm", "start" ]
EXPOSE 1234 # change to whatever port is to be used