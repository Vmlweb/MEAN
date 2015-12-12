# MEAN Stack Template

Quick and simple template to get up and running with a MEAN stack web application.

## Libraries

  * MongoDB
  * Express
  * AngularJS
  * NodeJS
  * Semantic UI
  * Jade
  * Stylus
  * Mocha
  * Moment
  * Mongoose

## Features

  * Grunt Workflows (Dev & Dist)
  * JS, Angular and CSS Minify
  * Jade and Stylus Templates
  * Dockerfile Generation
  * File & Console Logging
  * Mocha Unit Testing

## Installation

Install the Grunt command line tools if you have not already.

```bash
sudo npm install -g grunt-cli
```

Next download the repository and install dependancies.

```bash
git clone https://github.com/Vmlweb/MEAN.git && cd MEAN
npm install
grunt libs
```

## Development

For development you should be using the following folders.

- `app` - Create your server side application.
- `config` - Store file based configurations.
- `src` - Create your browser side application.
- `test` - Build your unit test cases.

While developing you can test the application by starting the development server.
You can carry on working on your files as it will reload any changes live.

```bash
grunt dev
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

To modify these settings and directories please see the `config/logging.js` file.

## Distribution

To compile a production ready version of your app use the following command.
This will also archive the app to a .tar.gz ready for deployment.

```bash
grunt dist
```

## Libraries

Browser side web libraries are stored in the `libs` folder and are generated via the following command.

```bash
grunt libs
```

In order to add new web libraries modify the `Gruntfile.js` file under the `copy:libs` task.

The semantic ui library source code can be found in the `semantic` folder and can be recompiled using the above command.