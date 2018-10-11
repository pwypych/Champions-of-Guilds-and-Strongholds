// @format

'use strict';

// External libraries
const debug = require('debug')('cogs:app');
const express = require('express');
const mongodb = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

// Instances of libraries
const app = express();
const path = require('path');

// Variables (for this file)
const environment = {};
let db;

(function init() {
  debug('');
  debug('');
  debug('');
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
  setupBodyParser();
}

function setupBodyParser() {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  debug('setupBodyParser()');
  setupMongo();
}

function setupMongo() {
  const connectionUrl = 'mongodb://localhost:27017';
  const dbName = 'cogs_0_1';
  const options = {
    useNewUrlParser: true
  };

  mongodb.connect(
    connectionUrl,
    options,
    (error, client) => {
      db = client.db(dbName);

      debug('setupMongo()');
      setupLibrariesAndRoutes();
    }
  );
}

/* eslint-disable global-require */
// prettier-ignore
function setupLibrariesAndRoutes() {
  // libraries
  const templateToHtml = require('./shared_libraries/templateToHtml.js')();
  const sanitizer = require('./shared_libraries/sanitizer.js')();

  // routes
  app.get('/', require('./landing/landing.js')(environment, templateToHtml));

  app.get('/0.1/gamePanel', require('./0.1/gamePanel/gamePanel.js')(environment, db, templateToHtml));
  app.post('/0.1/createGamePost', require('./0.1/gamePanel/createGamePost.js')(environment, sanitizer, db));

  app.post('/0.1/deleteGamePost', require('./0.1/gamePanel/deleteGamePost.js')(environment, sanitizer, db));

  debug('setupLibrariesAndRoutes()');
  setupExpress();
}
/* eslint-enable global-require */

function setupExpress() {
  debug('setupExpress()');
  debug('******************** start ********************');
  app.listen(3000);
}
