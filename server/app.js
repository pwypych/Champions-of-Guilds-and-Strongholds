// @format

'use strict';

// External libraries
const debug = require('debug')('cogs:app');
const express = require('express');

// Instances of libraries
const app = express();
const path = require('path');

// Variables (for this file)
const environment = {};

// eslint-disable-next-line no-console

(function init() {
  debug('init()');
  setupEnvironment();
})();

function setupEnvironment() {
  environment.baseurl = 'http://localhost:3000';
  environment.basepath = path.join(__dirname, '..');

  debug('setupEnvironment()', environment);
  setupLocals();
}

function setupLocals() {
  app.use((req, res, next) => {
    next();
  });

  debug('setupLocals()');
  setupStaticFolder();
}

function setupStaticFolder() {
  app.use(express.static('public'));

  debug('setupStaticFolder()');
  setupLibrariesAndRoutes();
}

// prettier-ignore
function setupLibrariesAndRoutes() {
  // libraries
  const templateToHtml = require('./libraries/templateToHtml.js')(environment);

  // routes
  app.get('/', require('./home/home.js')(environment, templateToHtml));
  app.get('/create-game', require('./createGame/createGame.js')(environment, templateToHtml));

  debug('setupLibrariesAndRoutes()');
  setupExpress();
}

function setupExpress() {
  debug('setupExpress()');
  debug('*** start ***');
  app.listen(3000);
}
