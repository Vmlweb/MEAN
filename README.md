# MEAN Stack Template

Quick and simple template to get up and running with a MEAN stack web application.

## Features

  * Grunt Workflows (Dev & Dist)
  * JS, Angular and CSS Minify
  * Jade and Stylus Templates
  * Dockerfile Generation
  * File & Console Logging
  * Mocha Unit Testing
  
## Libraries

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

Next download the repository and install dependancies.

```bash
git clone https://github.com/Vmlweb/MEAN.git && cd MEAN
npm install
grunt libs
```

If prompted use the default location or setting.

## Directory Structure

- `app` - Create your server side app.
- `config` - Store file based configs.
- `data` - MongoDB file storage.
- `dist` - Production ready builds.
- `libs` - Minified web frameworks
- `logs` - JSON logs from app
- `public` - Minified server side app
- `semantic` - Source for user interface framework.
- `src` - Create your browser side app.
- `test` - Build your unit test cases.

## Development

For development you should be using the following folders.

- `app` - Create your server side application.
- `config` - Store file based configurations.
- `semantic` - Make any interface changes to semantic ui.
- `src` - Create your browser side application.
- `test` - Build your unit test cases.

While developing you can test the application by starting the development server.
You can carry on working on your files as it will reload any changes live.

```bash
grunt dev
```

To make sure the development server is stopped run the following command.

```bash
grunt stop
```

You can execute your mocha tests that reside in the `tests` folder with this command.

```bash
grunt test
```

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

Browser side web libraries are stored in the `libs` folder and are generated via the following command.

```bash
grunt libs
```

In order to add new web libraries modify the `Gruntfile.js` file under the `copy:libs` task.

## Distribution

To compile a production ready version of your app to the `dist` directory use the following command.

```bash
grunt dist
```

You can then use the following commands to build dependancies and execute your server side app.

```bash
./server.sh build
./server.sh start
./server.sh stop
```

By default your logs and database files will be stored in the `/opt/` directory.