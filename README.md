# MEAN Stack Template

Quick and simple template to get up and running with a MEAN stack web app inside of docker.

## Features

  * Docker and Docker Networking
  * Grunt Workflows (Dev & Dist)
  * JS, Angular and CSS Minify
  * Jade and Stylus Templates
  * Winston File & Console Logging
  * Mocha, Karma and Chai Testing
  * Runs under PM2 (Multi-Core)
  
## Libraries

  * Docker
  * MongoDB
  * Express
  * AngularJS
  * NodeJS
  * Semantic UI
  * Mongoose

## Prequisitions

You will need to have the following packages installed on your machine.

```bash
Docker
NodeJS
Grunt
```

You can install the grunt command line tools with the following command.

```bash
sudo npm install -g grunt-cli
```

## Installation

Now install the project dependancies and setup the development environment.

```bash
git clone https://github.com/Vmlweb/MEAN.git
cd MEAN

npm install
grunt setup
```

If prompted for input use the default location or setting. (Press Enter)

## Configure SSL

To use the https protocol we can sign our own SSL certificate for now.

```bash
cd server/config/ssl
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
```

We must now unlock the certificate by entering the same password we entered above.

```bash
openssl rsa -in key.pem -out newkey.pem && mv newkey.pem key.pem
```

We're now ready to start using the development environment commands.

## Directory Structure

- `client` - Client side website source.
- `client/tests` - Testing setup for client website.
- `data` - Development database binary files.
- `dist` - Production ready distribution builds.
- `logs` - Development JSON log files.
- `public` - Built and minified client side website.
- `semantic` - User interface framework source.
- `server` - Server side application source.
- `server/api` - API endpoints for server app.
- `server/app` - Core functions for server app.
- `server/config` - Configurations for server app.
- `server/config/ssl` - SSL certificates for server app.
- `server/models` - Database models and schemas for server app.
- `server/test` - Testing setup for server app.

## File Structure

- `bower.json` - Client website package dependancies.
- `docker-compose.yml` - Layout for running distribution build with compose.
- `Dockerfile.mongo` - MongoDB database docker definition for distribution build.
- `Dockerfile.node` - NodeJS application docker definition for distribution build.
- `Grunt.js` - Workflow and build tasks.
- `MongoDB.js` - Executed in MongoDB on database setup.
- `package.json` - Server application package dependancies.
- `semantic.json` - User interface framework configuration.
- `server.sh` - Start or stop the production server.

## Development

For development the primary working directories are.

- `client` - Client side website source.
- `semantic` - User interface framework source.
- `server` - Server side application source.

You can start the development server which will rebuild any changes live.

```bash
grunt dev
```

Press `control + c` to stop and exit the development server.

Make sure the development server is stopped after you've finished working.

```bash
grunt stop
```

Use the following to reset the development server database and logs.

```bash
grunt reset
```

The development server stores its `data` and `logs` in the local directory.

## Logger

Use the following commands to log messages directly to the console and `logs` directory

```javascript
log.error('ERROR'); //Error log file
log.warn('WARN'); //Info log file
log.info('info'); //Info log file
log.verbose('verbose'); //Access log file
```

## Libraries

You can make changes to the user interface and themes in the `semantic` directory but must rebuild them to take affect.

```bash
grunt semantic
```

To add libraries to the client website first install them with bower.

```bash
bower install --save --allow-root jquery
```

Then add them to `Gruntfile.js` under the `copy:build` task and they be copied to the `/libs/` directory upon build. 

Also make sure you add them to `karma.conf.js` under `files` if you need them to be included in client website testing.

## Testing

You can execute the automated unit tests either combined or individually for the server and client.

```bash
grunt test
grunt test:client
grunt test:server
```

Test files should be included in the `server` and `client` directories and use the following filenames.

```bash
*.mock.js
*.stub.js
*.test.js
*.spec.js
*.db.js
```

The `data` and `logs` directories are not exposed when testing and will be reset after each test run.

You can also add testing libraries for the client website using bower.

```bash
bower install --save-dev --allow-root angular-mocks
```

Then add them to `Gruntfile.js` under the `copy:test` task and they be copied to the `/libs/` directory upon testing. 

Also make sure you add them to `karma.conf.js` under `files` so they are included when testing.

## Distribution

To compile and archive a production ready distribution build using the following commands.

```bash
grunt dist
grunt archive
```

These files will be generated in the `dist` directory.

- `mean_*.tar.gz` - Compressed version of all the files below.
- `docker-compose.yml` - Layout for running distribution build with compose.
- `mean_app.tar` - MongoDB docker image for distribution build.
- `mean_db.tar` - NodeJS docker image for distribution build.
- `MongoDB.js` - Executed in MongoDB on database setup.
- `server.sh` - Start or stop the production server.

## Executing Locally

To setup and reset your production database use the following command

```bash
cd dist
./server.sh reset
```

Use the `server.sh` file to start and stop your production app within docker.

```bash
./server.sh start
./server.sh stop
```

## Executing Externally

When transferred to another host you will need to either pull or load the docker images again and setup the production database.

```bash
chmod +x server.sh

docker load < mean_app.tar
docker load < mean_db.tar

./server.sh reset
```

You can then use the same commands mentioned above to execute the production app.