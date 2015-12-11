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

  * Grunt Workflows (Developmet and Distribution)
  * Javascript and CSS Minify
  * Jade and Stylus Templates
  * Dockerfile Generation

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

Execute the following to start the development web server at `http://127.0.0.1:1234/`.

```bash
grunt dev
```

## Directory Structure

- `app` - SOURCE for node app.
- `config` - CONFIG files for node app.
- `dist` - COMPILED production version of the whole app.
- `libs` - BUILT web libraries for development and testing.
- `public` - BUILT web app for development and testing.
- `semantic` - SOURCE files for Semantic UI (Can be built to /libs/ using grunt libs).
- `src` - SOURCE for web app.
- `test` - Automated unit test instances.

## Development

While developing you should be putting your source code in one of these two folders.

- `app` - Files executed in NodeJS.
- `src` - Files executed in browser.

When developing inside `src` all your `js` and `css` files will be minified.
  
## Grunt Workflows

### Grunt Libraries

This will build and copy and required web libraries into the `/libs/` folder.

```bash
grunt libs
```

Files from the `semantic` and `node_modules` folders will be built into the `libs` folder.

The current configured libraries are the following.

  * jQuery
  * AngularJS
  * AngularJS Routes
  * Semantic UI
  
You can add libraries in `Gruntfile.js` by appending the `copy:libs:files` configuration.

### Grunt Development

This will build all your source files ready for testing in browser.

```bash
grunt dev
```

Files from the `app` and `src` folders will be built into the `public` and development web server will start. The source folders will then be watched for changes to reload and restart the web server.

### Grunt Distribution

This will compile all your built files ready for production.

```bash
grunt dev
```

Files from the `app`, `src` and `libs` folders will be compiled and archived inside the `dist` directory ready for production use.