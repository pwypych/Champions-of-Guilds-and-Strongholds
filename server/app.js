// @format

'use strict';

// External libraries
const express = require('express');

// Instances of libraries
const app = express();

// Variables (for this file)
const environment = {};

// eslint-disable-next-line no-console
console.log('***STARTING***');

(function init() {
  setupEnvironment();
})();

function setupEnvironment() {
  environment.baseurl = 'http://localhost:3000';

  setupLocals();
}

function setupLocals() {
  app.use((req, res, next) => {
    next();
  });

  setupStaticFolder();
}

function setupStaticFolder() {
  app.use(express.static('public'));

  setupLibrariesAndRoutes();
}

function setupLibrariesAndRoutes() {
  // libraries

  // routes
  app.get('/', require('./home/home.js')(environment));

  setupExpress();
}

function setupExpress() {
  app.listen(3000);
}
