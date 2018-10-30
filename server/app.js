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
  const dbName = 'cogs_axe';
  const options = {
    useNewUrlParser: true
  };

  mongodb.connect(
    connectionUrl,
    options,
    (error, client) => {
      db = client.db(dbName);

      debug('setupMongo()');
      setupMapCollection();
    }
  );
}
/* eslint-disable global-require */
function setupMapCollection() {
  const generateMapCollection = require('./libraries/generateMapCollection.js')(
    environment,
    db
  );
  generateMapCollection((error) => {
    if (error) {
      debug('setupMapCollection: Error:', error);
      process.exit(1);
      return;
    }
    debug('setupMapCollection');
    setupLibrariesAndRoutes();
  });
}

/* eslint-disable global-require */
function setupLibrariesAndRoutes() {
  // libraries
  const templateToHtml = require('./libraries/templateToHtml.js')();
  const sanitizer = require('./libraries/sanitizer.js')();
  // const generateFigureManagerTree = require('./figure/generateFigureManagerTree.js')();

  // middlewares
  const middlewareTokenAuthentication = require('./ajax/middlewareTokenAuthentication.js')(
    sanitizer,
    db
  );

  // redirect form homepage to gamePanel
  app.get('/', (req, res) => {
    res.redirect('/gamePanel');
  });

  // gamePanel
  app.get(
    '/gamePanel',
    require('./gamePanel/gamePanel.js')(environment, db, templateToHtml)
  );
  app.post(
    '/gamePanel/createGameInstancePost',
    require('./gamePanel/createGameInstancePost.js')(environment, sanitizer, db)
  );

  app.post(
    '/gamePanel/deleteGameInstancePost',
    require('./gamePanel/deleteGameInstancePost.js')(environment, sanitizer, db)
  );

  // main game
  app.get(
    '/gameInstance',
    middlewareTokenAuthentication,
    require('./gameInstance/gameInstance.js')(environment, db, templateToHtml)
  );

  // ajax
  app.get(
    '/ajax/readMap',
    middlewareTokenAuthentication,
    require('./ajax/readMap.js')(db)
  );

  debug('setupLibrariesAndRoutes()');
  setupExpress();
}
/* eslint-enable global-require */

function setupExpress() {
  debug('setupExpress()');
  debug('******************** start ********************');
  app.listen(3000);
}
