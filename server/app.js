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
  environment.basepathTiledMap = environment.basepath + '/tiledMap';
  environment.basepathTiledTileset = environment.basepath + '/tiledTileset';
  environment.basepathFigure = environment.basepath + '/server/figure';

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
  const generateMapCollection = require('./library/generateMapCollection.js')(
    environment,
    db
  );
  generateMapCollection((error, mapCount) => {
    if (error) {
      debug('setupMapCollection: Errors:', error);
      process.exit(1);
      return;
    }

    debug('setupMapCollection: mapCount:', mapCount);
    setupFigureManagerTree();
  });
}
/* eslint-enable global-require */

/* eslint-disable global-require */
function setupFigureManagerTree() {
  const generateFigureManagerTree = require('./figure/generateFigureManagerTree.js')(
    environment
  );

  generateFigureManagerTree((error, figureManagerTree) => {
    if (error) {
      debug('setupFigureManagerTree: Errors:', error);
      process.exit(1);
      return;
    }

    debug('setupFigureManagerTree: figureManagerTree:', figureManagerTree);
    setupLibrariesAndRoutes(figureManagerTree);
  });
}
/* eslint-enable global-require */

/* eslint-disable global-require */
function setupLibrariesAndRoutes(figureManagerTree) {
  // libraries
  const templateToHtml = require('./library/templateToHtml.js')();
  const walkie = require('./library/walkie.js')();

  // middlewares

  // listeners
  require('./ajax/launchState/listener/everyPlayerReadyChecker.js')(
    walkie,
    db
  )();
  require('./ajax/launchState/listener/preparePlayerResource.js')(walkie, db)();
  require('./ajax/launchState/listener/prepareHeroFigure.js')(
    walkie,
    db,
    figureManagerTree
  )();
  require('./ajax/launchState/listener/launchCountdown.js')(walkie, db)();

  // redirect form homepage to panel
  app.get('/', (req, res) => {
    res.redirect('/panel');
  });

  // panel
  app.get(
    '/panel',
    require('./panel/panel.js')(environment, db, templateToHtml)
  );
  app.post(
    '/panel/createGamePost',
    require('./panel/createGamePost.js')(environment, db, figureManagerTree)
  );

  app.post(
    '/panel/deleteGamePost',
    require('./panel/deleteGamePost.js')(environment, db)
  );

  // main game
  app.get(
    '/game',
    require('./library/middlewareTokenAuth.js')(db),
    require('./game/game.js')(environment, db, templateToHtml)
  );

  // show Image
  app.get(
    '/image/figure/:imageName.png',
    require('./library/showImage.js')(environment)
  );

  // ajax
  app.get(
    '/ajax/stateDataGet',
    require('./library/middlewareTokenAuth.js')(db),
    require('./ajax/launchState/launchStateDataGet.js')(),
    require('./ajax/worldState/worldStateDataGet.js')()
  );

  app.post(
    '/ajax/launchState/playerNamePost',
    require('./library/middlewareTokenAuth.js')(db),
    require('./library/middlewareAjaxStateAuth.js')('launchState'),
    require('./ajax/launchState/playerNamePost.js')(db)
  );

  app.post(
    '/ajax/launchState/playerReadyPost',
    require('./library/middlewareTokenAuth.js')(db),
    require('./library/middlewareAjaxStateAuth.js')('launchState'),
    require('./ajax/launchState/playerReadyPost.js')(db, walkie)
  );

  app.post(
    '/ajax/worldState/hero/moveToPost',
    require('./library/middlewareTokenAuth.js')(db),
    require('./library/middlewareAjaxStateAuth.js')('worldState'),
    require('./ajax/worldState/hero/moveToPost.js')(db)
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
