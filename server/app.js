// @format

'use strict';

// External libraries
const express = require('express');

// Instances of libraries
const app = express();
const path = require('path');

// Variables (for this file)
const environment = {};

// eslint-disable-next-line no-console
console.log('***STARTING***');

(function init() {
  setupEnvironment();
})();

function setupEnvironment() {
  environment.baseurl = 'http://localhost:3000';
  environment.basepath = path.join(__dirname, '..');

  console.log('setupEnvironment()', environment);
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
  const templateToHtml = require('./libraries/templateToHtml.js')(environment);

  // routes
  app.get('/', require('./home/home.js')(environment, templateToHtml));

  console.log('setupLibrariesAndRoutes()');
  setupExpress();
}

function setupExpress() {
  console.log('setupExpress()');
  app.listen(3000);
}
