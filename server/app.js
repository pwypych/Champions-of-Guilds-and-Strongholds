// @format

'use strict';

// External libraries
const debug = require('debug')('cogs:app');
const _ = require('lodash');
const glob = require('glob');
const fs = require('fs');
const express = require('express');
const compression = require('compression');
const mongodb = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const path = require('path');

// Instances of libraries
const app = express();

// Main libraries
const hook = require('./library/hook.js')();
const templateToHtml = require('./library/templateToHtml.js')();

// Variables (for this file)
const environment = {};
const middleware = {};
let db;
let blueprint;
let spriteFilenameArray;

/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

(function init() {
  debug('');
  debug('');
  debug('');
  debug('// Main file, starts everything else');
  setupEnvironment();
})();

function setupEnvironment() {
  if (
    __dirname.substr(0, 11) === '/home/galh/' ||
    __dirname.substr(0, 14) === '/home/piotrek/'
  ) {
    environment.env = 'dev';
    environment.baseurl = 'http://localhost:3000';
  } else {
    environment.env = 'prod';
    environment.baseurl = 'https://axe.cogs.ovh';
  }
  environment.basepath = path.join(__dirname, '..');
  environment.basepathFigure = environment.basepath + '/server/figure';

  debug('setupEnvironment()', environment);
  buildClient();
}

function buildClient() {
  const pathRead = path.join(environment.basepath, '/server/game/**/c.*.js');
  glob(pathRead, {}, (error, pathFiles) => {
    if (error) {
      debug('buildClient: error:', error);
      return;
    }

    let build = '';
    pathFiles.forEach((pathFile) => {
      build += fs.readFileSync(pathFile, 'utf8');
    });

    const pathWrite = path.join(
      environment.basepath,
      '/public/build/bundle.js'
    );

    fs.writeFileSync(pathWrite, build);

    debug('buildClient: bundle.js', build.length);
    removeSprites();
  });
}

function removeSprites() {
  const pathRead = path.join(environment.basepath, '/public/sprite/*');
  glob(pathRead, {}, (error, pathFiles) => {
    if (error) {
      debug('removeSprites: error:', error);
      return;
    }

    pathFiles.forEach((pathFile) => {
      fs.unlinkSync(pathFile);
    });

    debug('removeSprites:', pathFiles.length);
    buildSprites();
  });
}

function buildSprites() {
  const pathRead = path.join(environment.basepath, '/server/game/**/*.png');
  glob(pathRead, {}, (error, pathFiles) => {
    if (error) {
      debug('buildSprites: error:', error);
      return;
    }

    // Create directory if not exits, git likes to delete this dir
    const pathDir = path.join(environment.basepath, '/public/sprite/');
    if (!fs.existsSync(pathDir)) {
      fs.mkdirSync(pathDir);
    }

    pathFiles.forEach((pathFile) => {
      const fileName = path.basename(pathFile);
      const pathCopy = path.join(
        environment.basepath,
        '/public/sprite/',
        fileName
      );
      fs.copyFileSync(pathFile, pathCopy);
    });

    debug('buildSprites:', pathFiles.length);
    setupCompression();
  });
}

function setupCompression() {
  app.use(compression());

  debug('setupCompression()');
  setupStaticFolder();
}

function setupStaticFolder() {
  app.use(express.static('public'));

  debug('setupStaticFolder()');
  setupBodyParser();
}

function setupBodyParser() {
  app.use(bodyParser.urlencoded({ limit: '10mb', parameterLimit: 1000000, extended: true }));
  app.use(bodyParser.json({ limit: '10mb', parameterLimit: 1000000}));

  debug('setupBodyParser()');
  setupMongo();
}

function setupMongo() {
  const connectionUrl = 'mongodb://localhost:27017';
  const dbName = 'cogs_axe';
  const options = {
    useNewUrlParser: true
  };

  mongodb.connect(connectionUrl, options, (error, client) => {
    db = client.db(dbName);

    debug('setupMongo()');
    setupHooks();
  });
}

function setupHooks() {
  const pathRead = path.join(environment.basepath, '/server/game/**/h.*.js');
  glob(pathRead, {}, (error, pathFiles) => {
    if (error) {
      debug('setupHooks: error:', error);
      return;
    }

    pathFiles.forEach((pathFile) => {
      require(pathFile)(hook);

      // const fileName = path.basename(pathFile);
      // debug('setupHooks: fileName:', fileName);
    });

    setupBlueprint();
  });
}

function setupBlueprint() {
  require('./library/setupBlueprint.js')(hook, (error, result) => {
    blueprint = result;
    debug('setupBlueprint: Main blueprint types:', _.size(blueprint));
    setupSpriteFilenameArray();
  });
}

function setupSpriteFilenameArray() {
  require('./library/setupSpriteFilenameArray.js')(
    environment,
    (error, result) => {
      spriteFilenameArray = result;
      debug(
        'setupSpriteFilenameArray: Loaded sprites!',
        spriteFilenameArray.length
      );
      setupInstrumentRoutesAndLibraries();
    }
  );
}

function setupInstrumentRoutesAndLibraries() {
  // libraries

  // general
  app.get('/', (req, res) => {
    res.redirect('/panelPredefined');
  });

  app.post(
    '/loadGame/loadGamePost',
    require('./instrument/loadGame/loadGamePost.js')(environment, db)
  );

  // Panel
  app.get(
    '/panelPredefined',
    require('./instrument/panel/panelPredefined.js')(
      environment,
      db,
      templateToHtml
    )
  );

  app.post(
    '/panelPredefined/createGamePost',
    require('./instrument/panel/createGamePost.js')(
      environment,
      db,
      blueprint
    )
  );

  app.post(
    '/panelPredefined/deleteGamePost',
    require('./instrument/panel/deleteGamePost.js')(
      environment,
      db
    )
  );

  app.post(
    '/panelPredefined/loadGamePost',
    require('./instrument/panel/loadGamePost.js')(
      environment,
      db
    )
  );

  app.get(
    '/panelPredefined/launchImmediately',
    require('./instrument/panel/launchImmediately.js')(
      environment,
      blueprint,
      templateToHtml
    )
  );

  app.get(
    '/inspector',
    require('./instrument/inspector/inspector.js')(
      environment,
      db,
      templateToHtml
    )
  );

  app.get(
    '/editorMap/mapChoose',
    require('./instrument/editorMap/mapChoose.js')(
      environment,
      db,
      templateToHtml
    )
  );

  app.get(
    '/editorMap/mapEdit',
    require('./instrument/editorMap/mapEdit.js')(
      environment,
      db,
      blueprint,
      templateToHtml
    )
  );

  app.post(
    '/editorMap/mapSavePost',
    require('./instrument/editorMap/mapSavePost.js')(environment, db)
  );

  app.post(
    '/editorMap/mapCreateNewPost',
    require('./instrument/editorMap/mapCreateNewPost.js')(environment, db)
  );

  app.get(
    '/editorLand/landChoose',
    require('./instrument/editorLand/landChoose.js')(
      environment,
      db,
      templateToHtml
    )
  );

  app.post(
    '/editorLand/landCreateNewPost',
    require('./instrument/editorLand/landCreateNewPost.js')(environment, db)
  );

  app.get(
    '/editorLand/landEdit',
    require('./instrument/editorLand/landEdit.js')(
      environment,
      db,
      blueprint,
      templateToHtml
    )
  );

  app.post(
    '/editorLand/landSavePost',
    require('./instrument/editorLand/landSavePost.js')(environment, db)
  );

  app.post(
    '/editorLand/landRandomizePost',
    require('./instrument/editorLand/landRandomizePost.js')(
      environment,
      blueprint,
      db
    )
  );

  app.post(
    '/editorLand/landGenerateMapPost',
    require('./instrument/editorLand/conditions/areFiguresAbleToReachEachOther.js')(),
    require('./instrument/editorLand/conditions/exitRightOpenClosed.js')(),
    require('./instrument/editorLand/conditions/exitBottomOpenClosed.js')(),
    require('./instrument/editorLand/conditions/exitLeftOpenClosed.js')(),
    require('./instrument/editorLand/conditions/exitTopOpenClosed.js')(),
    require('./instrument/editorLand/landGenerateMapPost.js')(
      environment,
      blueprint,
      db
    )
  );

  debug('setupInstrumentRoutesAndLibraries');
  setupMiddleware();
}

function setupMiddleware() {
  const pathRead = path.join(environment.basepath, '/server/game/**/m.*.js');
  glob(pathRead, {}, (error, pathFiles) => {
    if (error) {
      debug('setupMiddleware: error:', error);
      return;
    }

    pathFiles.forEach((pathFile) => {
      const fileName = path.basename(pathFile);
      const name = fileName.substr(2, fileName.length - 5);

      // Those libraries are injected into every middleware
      middleware[name] = require(pathFile)(db, blueprint, hook);

      // debug('setupMiddleware: fileName:', fileName);
    });

    debug('setupMiddleware: Loaded middleware!', _.size(middleware));
    // debug('!!!', middleware);
    setupRoutes();
  });
}

function setupRoutes() {
  const pathRead = path.join(environment.basepath, '/server/game/**/r.*.js');
  glob(pathRead, {}, (error, pathFiles) => {
    if (error) {
      debug('setupRoutes: error:', error);
      return;
    }

    pathFiles.forEach((pathFile) => {
      const fileName = path.basename(pathFile);

      // Those objects are injected into every route module
      require(pathFile)(app, middleware);

      debug('setupRoutes: fileName:', fileName);
    });

    debug('setupRoutes: Loaded routes!', _.size(pathFiles));
    setupEjsToHtml();
  });
}

function setupEjsToHtml() {
  const htmlArray = [];

  const pathRead = path.join(environment.basepath, '/server/game/**/e.*.ejs');
  glob(pathRead, {}, (errorReadFile, pathFiles) => {
    if (errorReadFile) {
      debug('setupEjsToHtml: error:', errorReadFile);
      return;
    }

    const done = _.after(_.size(pathFiles), () => {
      debug('setupEjsToHtml', 'Loaded ejs modules!', _.size(pathFiles));
      setupGameRoute(htmlArray);
    });

    pathFiles.forEach((pathFile) => {
      const viewModel = {};
      viewModel.baseurl = environment.baseurl;
      viewModel.timestamp = Date.now();

      templateToHtml(pathFile, viewModel, (error, html) => {
        htmlArray.push(html);
        done();
      });
    });
  });
}

function setupGameRoute(htmlArray) {
  app.get(
    '/game',
    middleware.readEntities,
    middleware.authenticateToken,
    require('./game.js')(
      environment,
      db,
      blueprint,
      spriteFilenameArray,
      htmlArray,
      templateToHtml
    )
  );

  debug('setupGame');
  setupExpress();
}

function setupExpress() {
  debug('setupExpress()');
  debug('******************** start ********************');
  app.listen(3000);
}
