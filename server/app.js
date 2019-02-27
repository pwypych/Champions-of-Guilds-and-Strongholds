// @format

'use strict';

// External libraries
const debug = require('debug')('cogs:app');
const express = require('express');
const mongodb = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const compose = require('compose-middleware').compose;

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
  debug('// Main file, starts everything else');
  setupEnvironment();
})();

function setupEnvironment() {
  if (
    __dirname.substr(0, 11) === '/home/galw/' ||
    __dirname.substr(0, 14) === '/home/piotrek/'
  ) {
    environment.env = 'dev';
    environment.baseurl = 'http://localhost:3000';
  } else {
    environment.env = 'prod';
    environment.baseurl = 'https://axe.cogs.ovh';
  }
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
  const findEntitiesByGameId = require('./library/findEntitiesByGameId.js')(db);

  // general
  app.get('/', (req, res) => {
    res.redirect('/panel');
  });

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

  app.post(
    '/panel/loadGamePost',
    require('./panel/loadGamePost.js')(environment, db)
  );

  app.get(
    '/game',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./game/game.js')(environment, db, templateToHtml)
  );

  app.get(
    '/ajax/entitiesGet',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./ajax/launch/entities/launchEntitiesGet.js')(),
    require('./ajax/world/entities/worldEntitiesGet.js')(),
    require('./ajax/battle/entities/battleEntitiesGet.js')(),
    require('./ajax/summary/entities/summaryEntitiesGet.js')()
  );

  app.get(
    '/ajax/cheat/entities/cheatEntitiesGet',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./ajax/cheat/entities/cheatEntitiesGet.js')()
  );

  // launch
  app.post(
    '/ajax/launch/ready/playerReadyPost',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('launchState'),
    require('./ajax/launch/ready/playerReadyPost.js')(db),
    require('./library/readEntities.js')(db),
    require('./ajax/launch/ready/everyPlayerReadyChecker.js')(),
    require('./ajax/launch/ready/preparePlayerResource.js')(db),
    require('./ajax/launch/ready/prepareHeroFigure.js')(db),
    require('./ajax/launch/ready/launchCountdown.js')(db),
    require('./ajax/launch/ready/unsetReadyForLaunch.js')(db)
  );

  app.post(
    '/ajax/launch/name/playerNamePost',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('launchState'),
    require('./ajax/launch/name/playerNamePost.js')(db)
  );

  // world
  app.get(
    '/ajax/world/load/spriteFilenameArray',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./ajax/world/load/spriteFilenameArrayGet.js')(environment)
  );

  const saveGame = compose([
    require('./library/readEntities.js')(db),
    require('./ajax/saveLoad/saveGame.js')(db)
  ]);

  app.post(
    '/ajax/world/movement/pathPost',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('worldState'),
    require('./ajax/commonMovement/entityIdVerify.js')(),
    require('./ajax/commonMovement/flagIsProcessingInspect.js')(),
    require('./ajax/commonMovement/pathVerify.js')(),
    require('./ajax/world/movement/pathHeroMovementPointsVerify.js')(),
    require('./ajax/world/movement/pathCollisionInWorldVerify.js')(),
    require('./ajax/world/movement/heroMovementPointsDecrement.js')(db),
    require('./ajax/commonMovement/flagIsProcessingCreate.js')(db),
    require('./ajax/commonMovement/recentActivityOnMovement.js')(db),
    require('./ajax/commonMovement/pathSendResponse.js')(),
    require('./ajax/commonMovement/movementTimeout.js')(),
    require('./ajax/commonMovement/positionUpdate.js')(db),
    require('./ajax/world/movement/collectResource.js')(db),
    require('./ajax/world/movement/battleInitiate.js')(db),
    saveGame
  );

  const unitStats = require('./ajax/world/endTurn/unitStats.js');
  app.post(
    '/ajax/world/endTurn/endTurnPost',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('worldState'),
    require('./ajax/world/endTurn/endTurnPost.js')(db),
    require('./ajax/world/endTurn/zeroHeroMovementPoints.js')(db),
    require('./ajax/world/endTurn/endTurnCountdown.js')(
      db,
      findEntitiesByGameId
    ),
    require('./library/readEntities.js')(db),
    require('./ajax/world/endTurn/battleChecker.js')(db),
    require('./ajax/world/endTurn/createBattle.js')(db, unitStats),
    require('./ajax/world/endTurn/newDay.js')(db),
    require('./ajax/world/endTurn/refillHeroMovement.js')(db),
    require('./ajax/world/endTurn/unsetEndTurnFlags.js')(db)
  );

  app.post(
    '/ajax/world/recruit/recruitUnitPost',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('worldState'),
    require('./ajax/world/recruit/recruitUnitPost.js')(db, unitStats)
  );

  // battle
  const maneuverVerify = compose([
    require('./library/readEntities.js')(db),
    require('./ajax/commonMovement/entityIdVerify.js')(),
    require('./ajax/battle/maneuver/verify/checkUnitOwner.js')(),
    require('./ajax/battle/maneuver/verify/checkUnitActive.js')(),
    require('./ajax/battle/maneuver/verify/checkUnitManeuverGreatherThenZero.js')()
  ]);

  const maneuverDigest = compose([
    require('./library/readEntities.js')(db),
    require('./ajax/battle/maneuver/digest/decrementUnitManeuver.js')(db),
    require('./ajax/battle/maneuver/digest/ifBattleFinishedChangeState.js')(db),
    require('./library/readEntities.js')(db),
    require('./ajax/battle/maneuver/verify/checkIsUnitManeuverZero.js')(),
    require('./ajax/battle/maneuver/verify/ifEveryUnitManeuverZeroRefill.js')(
      db
    ),
    require('./library/readEntities.js')(db),
    require('./ajax/battle/maneuver/digest/nominateNewActiveUnit.js')(db)
  ]);

  app.post(
    '/ajax/battle/movement/pathPost',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('battleState'),
    maneuverVerify,
    require('./ajax/commonMovement/flagIsProcessingInspect.js')(),
    require('./ajax/commonMovement/pathVerify.js')(),
    require('./ajax/battle/movement/pathUnitMovementPointsVerify.js')(),
    require('./ajax/battle/movement/pathCollisionInBattleVerify.js')(),
    require('./ajax/commonMovement/flagIsProcessingCreate.js')(db),
    require('./ajax/commonMovement/recentActivityOnMovement.js')(db),
    require('./ajax/commonMovement/pathSendResponse.js')(),
    require('./ajax/commonMovement/movementTimeout.js')(),
    require('./ajax/commonMovement/positionUpdate.js')(db),
    maneuverDigest,
    saveGame
  );

  app.post(
    '/ajax/battle/melee/maneuverMeleePost',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('battleState'),
    require('./ajax/battle/maneuver/maneuverSendResponse.js')(),
    maneuverVerify,
    require('./ajax/battle/melee/maneuverMelee.js')(db),
    maneuverDigest,
    saveGame
  );

  app.post(
    '/ajax/battle/shoot/maneuverShootPost',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('battleState'),
    require('./ajax/battle/maneuver/maneuverSendResponse.js')(),
    maneuverVerify,
    require('./ajax/battle/shoot/maneuverShoot.js')(db),
    maneuverDigest
  );

  // summary
  app.post(
    '/ajax/summary/summaryConfirmPost',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('summaryState'),
    require('./ajax/summary/confirm/summaryConfirm.js')(db),
    require('./library/readEntities.js')(db),
    require('./ajax/summary/confirm/worldChecker.js')(db),
    require('./ajax/world/endTurn/battleChecker.js')(db),
    require('./ajax/world/endTurn/createBattle.js')(db, unitStats),
    require('./ajax/world/endTurn/newDay.js')(db),
    require('./ajax/world/endTurn/refillHeroMovement.js')(db),
    require('./ajax/world/endTurn/unsetEndTurnFlags.js')(db)
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
