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
  environment.basepathTiledMap =
    environment.basepath + '/tiled/tiledPredefinedMap';
  environment.basepathTiledLand = environment.basepath + '/tiled/tiledLand';
  environment.basepathTiledParcel = environment.basepath + '/tiled/tiledParcel';
  environment.basepathTiledTileset =
    environment.basepath + '/tiled/tiledTileset';
  environment.basepathFigure = environment.basepath + '/server/figure';

  debug('setupEnvironment()', environment);
  buildClient();
}

function buildClient() {
  const pathRead = path.join(environment.basepath, '/client/**/*.js');
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
    buildSprites();
  });
}

function buildSprites() {
  const pathRead = path.join(
    environment.basepath,
    '/server/game/plugin/**/*.png'
  );
  glob(pathRead, {}, (error, pathFiles) => {
    if (error) {
      debug('buildSprites: error:', error);
      return;
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

  mongodb.connect(connectionUrl, options, (error, client) => {
    db = client.db(dbName);

    debug('setupMongo()');
    setupPredefinedMapCollection();
  });
}

function setupPredefinedMapCollection() {
  const generateMapCollection = require('./instrument/tiled/generatePredefinedMapCollection.js')(
    environment,
    db
  );
  generateMapCollection((error, mapCount) => {
    if (error) {
      debug('setupPredefinedMapCollection: Errors:', error);
      process.exit(1);
      return;
    }

    debug('setupPredefinedMapCollection: mapCount:', mapCount);
    setupParcelCollection();
  });
}

function setupParcelCollection() {
  const generateParcelCollection = require('./instrument/tiled/generateParcelCollection.js')(
    environment,
    db
  );
  generateParcelCollection((error, parcelCount) => {
    if (error) {
      debug('setupParcelCollection: Errors:', error);
      process.exit(1);
      return;
    }

    debug('setupParcelCollection: parcelCount:', parcelCount);
    setupLandCollection();
  });
}

function setupLandCollection() {
  const generateLandCollection = require('./instrument/tiled/generateLandCollection.js')(
    environment,
    db
  );
  generateLandCollection((error, landCount) => {
    if (error) {
      debug('setupLandCollection: Errors:', error);
      process.exit(1);
      return;
    }

    debug('setupLandCollection: landCount:', landCount);
    setupHooks();
  });
}

function setupHooks() {
  const pathRead = path.join(
    environment.basepath,
    '/server/game/plugin/**/*.hook.js'
  );
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
    setupInstrumentRoutesAndLibraries();
  });
}

function setupInstrumentRoutesAndLibraries() {
  // libraries

  // general
  app.get('/', (req, res) => {
    res.redirect('/panelRandom');
  });

  app.get(
    '/panelRandom',
    require('./instrument/panel/random/panelRandom.js')(
      environment,
      db,
      templateToHtml
    )
  );

  app.post(
    '/panelRandom/createGameRandomPost',
    require('./instrument/panel/random/generateMap/findLandByName.js')(db),
    require('./instrument/panel/random/generateMap/generateParcelCategoryExitList.js')(
      db
    ),
    require('./instrument/panel/random/generateMap/generateParcelMap.js')(),
    require('./instrument/panel/random/generateMap/generateAbstractFigureMap.js')(),
    require('./instrument/panel/random/generateMap/generateFigureMap.js')(),
    require('./instrument/panel/random/generateMap/addMonsterToFigureMap.js')(
      environment,
      hook
    ),
    require('./instrument/panel/random/generateMap/addBarrierToFigureMap.js')(),
    require('./instrument/panel/random/generateMap/addTreasureToFigureMap.js')(),
    require('./instrument/panel/random/generateMap/addNonAbstractToFgureMap.js')(),
    require('./instrument/panel/random/createGameRandomPost.js')(
      environment,
      db,
      blueprint
    )
  );

  app.post(
    '/panelRandom/deleteGameRandomPost',
    require('./instrument/panel/random/deleteGameRandomPost.js')(
      environment,
      db
    )
  );

  app.post(
    '/panelRandom/loadGamePost',
    require('./instrument/panel/random/loadGamePost.js')(environment, db)
  );

  // Old Panel
  app.get(
    '/panelPredefined',
    require('./instrument/panel/predefined/panelPredefined.js')(
      environment,
      db,
      templateToHtml
    )
  );

  app.post(
    '/panelPredefined/createGamePredefinedPost',
    require('./instrument/panel/predefined/createGamePredefinedPost.js')(
      environment,
      db,
      blueprint
    )
  );

  app.post(
    '/panelPredefined/deleteGamePredefinedPost',
    require('./instrument/panel/predefined/deleteGamePredefinedPost.js')(
      environment,
      db
    )
  );

  app.post(
    '/panelPredefined/loadGamePost',
    require('./instrument/panel/predefined/loadGamePredefinedPost.js')(
      environment,
      db
    )
  );

  debug('setupInstrumentRoutesAndLibraries');
  setupMiddleware();
}

function setupMiddleware() {
  const pathRead = path.join(
    environment.basepath,
    '/server/game/plugin/**/*.mid.js'
  );
  glob(pathRead, {}, (error, pathFiles) => {
    if (error) {
      debug('setupMiddleware: error:', error);
      return;
    }

    pathFiles.forEach((pathFile) => {
      const fileName = path.basename(pathFile);
      const name = fileName.substr(0, fileName.length - 7);

      // Those libraries are injected into every middleware
      middleware[name] = require(pathFile)(db, blueprint, hook);

      // debug('setupMiddleware: fileName:', fileName);
    });

    debug('setupMiddleware: Loaded middleware!', _.size(middleware));
    setupRoutes();
  });
}

function setupRoutes() {
  const pathRead = path.join(
    environment.basepath,
    '/server/game/plugin/**/*.rt.js'
  );
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
    setupSpriteFilenameArray();
  });
}

function setupSpriteFilenameArray() {
  require('./library/setupSpriteFilenameArray.js')(
    environment,
    (error, spriteFilenameArray) => {
      debug(
        'setupSpriteFilenameArray: Loaded sprites!',
        spriteFilenameArray.length
      );
      setupEjsToHtml(spriteFilenameArray);
    }
  );
}

function setupEjsToHtml(spriteFilenameArray) {
  const htmlArray = [];

  const pathRead = path.join(
    environment.basepath,
    '/server/game/plugin/**/*.ejs'
  );
  glob(pathRead, {}, (errorReadFile, pathFiles) => {
    if (errorReadFile) {
      debug('setupEjsToHtml: error:', errorReadFile);
      return;
    }

    const done = _.after(_.size(pathFiles), () => {
      debug('setupEjsToHtml', 'Loaded ejs modules!', _.size(pathFiles));
      setupGameRoute(spriteFilenameArray, htmlArray);
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

function setupGameRoute(spriteFilenameArray, htmlArray) {
  app.get(
    '/game',
    middleware.readEntities,
    middleware.authenticateToken,
    require('./game/game.js')(
      environment,
      db,
      blueprint,
      spriteFilenameArray,
      htmlArray,
      templateToHtml
    )
  );

  debug('setupGame');
  setupLibrariesAndRoutes();
}

function setupLibrariesAndRoutes() {
  // launch
  app.post(
    '/ajax/launch/name/playerNamePost',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('launchState'),
    middleware.playerNamePost
  );

  app.post(
    '/ajax/launch/race/playerRacePost',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('launchState'),
    middleware.playerRacePost
  );

  // world
  app.post(
    '/ajax/world/movement/pathPost',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('worldState'),

    // common / movement
    middleware.entityIdVerify,
    middleware.flagIsProcessingInspect,
    middleware.pathVerify,

    // world / movement
    middleware.pathHeroMovementPointsSlice,
    middleware.pathIfBattleSlice,
    middleware.pathIfResourceSlice,
    middleware.pathCollisionInWorldVerify,
    middleware.heroMovementPointsDecrement,

    // common / movement
    middleware.flagIsProcessingCreate,
    middleware.recentActivityOnMovement,
    middleware.pathSendResponse,
    middleware.movementTimeout,
    middleware.positionUpdate,

    // world / movement
    middleware.collectResource,
    middleware.battleNpcInitiate,
    middleware.battleClashInitiate,

    // save
    middleware.readEntities,
    middleware.saveGame
  );

  app.post(
    '/ajax/world/endTurn/endTurnPost',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('worldState'),

    // world / endTurn
    middleware.endTurnPost,
    middleware.zeroHeroMovementPoints,
    middleware.endTurnCountdown,
    middleware.readEntities,
    middleware.battleChecker,
    middleware.battleNpcCreate,
    middleware.battleClashCreate,
    middleware.newDay,
    middleware.readEntities,
    middleware.enchantmentIncomeExecutor,
    middleware.refillHeroMovement,
    middleware.unsetEndTurnFlags
  );

  app.post(
    '/ajax/world/recruit/recruitUnitPost',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('worldState'),
    middleware.recruitUnitPost
  );

  app.post(
    '/ajax/world/build/buildFortificationPost',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('worldState'),
    middleware.buildFortificationPost
  );

  app.post(
    '/ajax/battle/movement/pathPost',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('battleState'),

    // maneuverVerify
    middleware.readEntities,
    middleware.entityIdVerify,
    middleware.checkUnitOwner,
    middleware.checkUnitActive,
    middleware.checkUnitManeuverGreatherThenZero,

    middleware.flagIsProcessingInspect,
    middleware.pathVerify,
    middleware.pathUnitMovementPointsVerify, // battle/movement
    middleware.walkPathInBattleVerify, // battle/movement
    middleware.flyPathInBattleVerify, // battle/movement
    middleware.isUnitRetreatFromEnemy, // battle/movement
    middleware.flagIsProcessingCreate,
    middleware.recentActivityOnMovement,
    middleware.pathSendResponse,
    middleware.movementTimeout,
    middleware.positionUpdate,

    // maneuverDigest
    middleware.readEntities,
    middleware.decrementUnitManeuver,
    middleware.ifBattleFinishedChangeState,
    middleware.readEntities,
    middleware.checkIsUnitManeuverZero,
    middleware.ifEveryUnitManeuverZeroRefill,
    middleware.readEntities,
    middleware.nominateNewActiveUnit,

    // save
    middleware.readEntities,
    middleware.saveGame
  );

  app.post(
    '/ajax/battle/melee/maneuverMeleePost',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('battleState'),
    middleware.sendResponseEarly,

    // maneuverVerify
    middleware.readEntities,
    middleware.entityIdVerify,
    middleware.checkUnitOwner,
    middleware.checkUnitActive,
    middleware.checkUnitManeuverGreatherThenZero,

    middleware.maneuverMelee,

    // maneuverDigest
    middleware.readEntities,
    middleware.decrementUnitManeuver,
    middleware.ifBattleFinishedChangeState,
    middleware.readEntities,
    middleware.checkIsUnitManeuverZero,
    middleware.ifEveryUnitManeuverZeroRefill,
    middleware.readEntities,
    middleware.nominateNewActiveUnit,

    // save
    middleware.readEntities,
    middleware.saveGame
  );

  app.post(
    '/ajax/battle/shoot/maneuverShootPost',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('battleState'),
    middleware.sendResponseEarly,

    // maneuverVerify
    middleware.readEntities,
    middleware.entityIdVerify,
    middleware.checkUnitOwner,
    middleware.checkUnitActive,
    middleware.checkUnitManeuverGreatherThenZero,

    middleware.maneuverShoot,

    // maneuverDigest
    middleware.readEntities,
    middleware.decrementUnitManeuver,
    middleware.ifBattleFinishedChangeState,
    middleware.readEntities,
    middleware.checkIsUnitManeuverZero,
    middleware.ifEveryUnitManeuverZeroRefill,
    middleware.readEntities,
    middleware.nominateNewActiveUnit,

    // save
    middleware.readEntities,
    middleware.saveGame
  );

  app.post(
    '/ajax/battle/wait/maneuverWait',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('battleState'),
    middleware.sendResponseEarly,

    // maneuverVerify
    middleware.readEntities,
    middleware.entityIdVerify,
    middleware.checkUnitOwner,
    middleware.checkUnitActive,
    middleware.checkUnitManeuverGreatherThenZero,

    middleware.maneuverWait,

    // maneuverDigest
    middleware.readEntities,
    middleware.decrementUnitManeuver,
    middleware.ifBattleFinishedChangeState,
    middleware.readEntities,
    middleware.checkIsUnitManeuverZero,
    middleware.ifEveryUnitManeuverZeroRefill,
    middleware.readEntities,
    middleware.nominateNewActiveUnit,

    // save
    middleware.readEntities,
    middleware.saveGame
  );

  app.post(
    '/ajax/battle/activate/activateUnitPost',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('battleState'),
    middleware.readEntities,
    middleware.entityIdVerify,
    middleware.checkUnitOwner,
    middleware.sendResponseEarly,
    middleware.maneuverActivateUnit
  );

  // summary
  app.post(
    '/ajax/summary/summaryConfirmPost',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('summaryState'),
    middleware.summaryConfirm,
    middleware.readEntities,
    middleware.worldChecker,

    // world / endTurn
    middleware.battleChecker,
    middleware.battleNpcCreate,
    middleware.battleClashCreate,
    middleware.newDay,
    middleware.refillHeroMovement,
    middleware.unsetEndTurnFlags
  );

  debug('setupLibrariesAndRoutes()');
  setupExpress();
}

function setupExpress() {
  debug('setupExpress()');
  debug('******************** start ********************');
  app.listen(3000);
}
