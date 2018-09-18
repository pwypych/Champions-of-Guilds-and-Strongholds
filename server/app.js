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

  console.log('setupEnvironment()');
  setupLocals();
}

function setupLocals() {
  app.use((req, res, next) => {
    next();
  });

  console.log('setupLocals()');
  setupStaticFolder();
}

function setupStaticFolder() {
  app.use(express.static('public'));

  console.log('setupStaticFolder()');
  setupLibrariesAndRoutes();
}

function setupLibrariesAndRoutes() {
  // libraries

  // routes
  app.get('/', require('./home/home.js')(environment));

  console.log('setupLibrariesAndRoutes()');
  setupExpress();
}

function setupExpress() {
  console.log('setupExpress()');
  app.listen(3000);
}
