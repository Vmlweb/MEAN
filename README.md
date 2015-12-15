# MEAN Stack Template

Quick and simple template to get up and running with a MEAN stack web application inside of docker.

## Features

  * Docker and Compose Based
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
  * Process Manager 2

## Installation

Install the Grunt and Gulp command line tools if you have not already.

```bash
sudo npm install -g grunt-cli
sudo npm install -g gulp-cli
```

Next download the repository, install its dependancies and build the docker image.

```bash
git clone https://github.com/Vmlweb/MEAN.git && cd MEAN
npm install
grunt libs

chmod +x ./server.sh
./server.sh build
```

If prompted for input use the default location or setting.

## Directory Structure

- `api` - Web api calls for your server.
- `app` - Core server side app.
- `classes` - Class prototypes.
- `config` - File based config files.
- `data` - Database file storage (Dev).
- `dist` - Production ready builds.
- `libs` - Minified web frameworks.
- `logs` - JSON logs from app.
- `mocks` - JSON mock database.
- `public` - Minified client side app.
- `semantic` - Source for ui framework.
- `src` - Core client side app.
- `test` - Unit test cases.

## Development

For development your primary working directories are.

- `api` - Web api calls for your server.
- `app` - Core server side app.
- `classes` - Class prototypes.
- `config` - File based config files.
- `mocks` - JSON mock database.
- `semantic` - Source for ui framework.
- `src` - Core client side app.
- `test` - Unit test cases.

While working you can start the development server which will reload any changes live.

```bash
grunt dev
```

To make sure the development server is stopped.

```bash
grunt stop
```

## Testing

You can execute your mocha tests that from the `tests` directory.

```bash
grunt test
```

Your test database will be wiped each time and reimported with any JSON files in the `mocks` directory.

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

In order to add new web libraries modify the `Gruntfile.js` file under the `copy:libs` task.

## Distribution

To compile a production ready version of your app to the `dist` directory use the following command.

```bash
grunt dist
```

Use the following to start and stop your app within docker.

```bash
cd dist
./server.sh start
./server.sh stop
```

When in distribution your logs and database files will be stored in the `/opt/` directory.

## Docker

Your application is now a docker image so use the following command to re-build on other hosts.

```bash
./server.sh build
```

You may also use docker compose to execute the application.

```bash
docker-compose build
docker-compose up
docker-compose down
```