# MEAN Stack Template

Quick and simple template to get up and running with a MEAN stack web app inside of docker.

## Features

  * Docker or Compose Based
  * Grunt Workflows (Dev & Dist)
  * JS, Angular and CSS Minify
  * Jade and Stylus Templates
  * File & Console Logging
  * Mocha Unit Testing
  * Runs under PM2 (Multi-Core)
  
## Libraries

  * Docker
  * MongoDB
  * Express
  * AngularJS
  * NodeJS
  * Semantic UI
  * Mocha
  * Mongoose

## Installation

Install the Grunt and Gulp command line tools if you have not already.

```bash
sudo npm install -g grunt-cli
sudo npm install -g gulp-cli
```

Next download the repository, install its dependancies and run the setup command.

```bash
git clone https://github.com/Vmlweb/MEAN.git && cd MEAN
npm install
grunt setup
```

If prompted for input use the default location or setting.

## Directory Structure

- `api` - Api calls for the server app.
- `app` - Core of the server app.
- `classes` - Class prototype definitions.
- `config` - File based configurations.
- `data` - Development database files.
- `dist` - Production ready builds.
- `libs` - Minified web frameworks.
- `logs` - Development log files.
- `mocks` - Mock testing database.
- `public` - Minified client app.
- `semantic` - Source for ui framework.
- `src` - Core of the client app.
- `test` - Automated unit tests.

## File Structure

- `app.js` - Start point for the server app.
- `docker-compose.yml` - Layout for running the production server inside of compose.
- `Dockerfile.mongo` - Database docker definition for production.
- `Dockerfile.node` - Core app docker definition for production.
- `Grunt.js` - Workflow and building tasks.
- `Mongo.js` - Executed in mongo on database reset.
- `semantic.json` - User interface configurations.
- `server.sh` - Start or stop the production server.

## Development

For development your primary working directories are.

- `api` - Api calls for the server app.
- `app` - Core of the server app.
- `classes` - Class prototype definitions.
- `config` - File based configurations.
- `mocks` - Mock testing database.
- `semantic` - Source for ui framework.
- `src` - Core of the client app.
- `test` - Automated unit tests.

While working you can start the development server which will reload any changes live.

```bash
grunt dev
```

Make sure the development server is stopped after you've finished working.

```bash
grunt stop
```

Use the following to reset the development database.

```bash
grunt reset
```

The development server stores its `data` and `logs` in the local directory.

## Testing

You can execute your unit tests that from the `tests` directory.

```bash
grunt test
```

The test server will be wiped each time and the database populated with any JSON files in the `mocks` directory.

## Logger

Use the following commands to log messages directly to the console and `logs` directory

```javascript
log.error('ERROR'); //Error log file
log.warn('WARN'); //Info log file
log.info('info'); //Info log file
log.verbose('verbose'); //Access log file
log.debug('debug'); //Console only
log.silly('silly'); //Console only
```

## Libraries

Browser side web libraries are stored in the `libs` folder and are generated with the following command.

```bash
grunt libs
```

To add new web libraries modify the `Gruntfile.js` file under the `copy:libs` task.

## Distribution

To compile and archive a production ready server app using the following commands.

```bash
grunt dist
grunt archive
```

These files will be generated in the `dist` directory.

- `mean_*.tar.gz` - Compressed version of files below.
- `mean.tar` - Docker images for both app and database.
- `docker-compose.yml` - Layout for running the production server inside of compose.
- `Mongo.js` - Executed in mongo on database reset.
- `server.sh` - Start or stop the production server.

## Executing Locally

Use the `server.sh` file to start and stop your server app within docker.

```bash
cd dist
chmod +x server.sh

./server.sh start
./server.sh stop
```

To reset your production database and execute `Mongo.js` use the following command

```bash
./server.sh reset
```

You may also use docker compose to run the server app.

```bash
docker-compose up
docker-compose down
```

## Executing Externally

When transferred to another host you will need to either pull or load the images again.

```bash
docker load < mean.tar
```

You can then use the same commands mentioned above to execute the server app.