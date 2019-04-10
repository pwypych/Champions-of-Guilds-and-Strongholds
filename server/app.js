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
  environment.basepathTiledParcel = environment.basepath + '/tiledParcel';
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
    // setupLibrariesAndRoutes();
    setupParcelCollection();
  });
}
/* eslint-enable global-require */

/* eslint-disable global-require */
function setupParcelCollection() {
  const generateParcelCollection = require('./library/generateParcelCollection.js')(
    environment,
    db
  );
  generateParcelCollection((error, parcelCount) => {
    if (error) {
      debug('setupMapCollection: Errors:', error);
      process.exit(1);
      return;
    }

    debug('setupParcelCollection: parcelCount:', parcelCount);
    setupLibrariesAndRoutes();
  });
}
/* eslint-enable global-require */

/* eslint-disable global-require */
function setupLibrariesAndRoutes() {
  // libraries
  const templateToHtml = require('./library/templateToHtml.js')();
  const findEntitiesByGameId = require('./library/findEntitiesByGameId.js')(db);

  const unitBlueprint = require('./ajax/blueprint/unitBlueprint.js');
  const figureBlueprint = require('./ajax/blueprint/figureBlueprint.js');
  const raceBlueprint = require('./ajax/blueprint/raceBlueprint.js');

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
    require('./panel/createGamePost.js')(environment, db, figureBlueprint)
  );

  app.post(
    '/panel/deleteGamePost',
    require('./panel/deleteGamePost.js')(environment, db)
  );

  app.post(
    '/panel/loadGamePost',
    require('./panel/loadGamePost.js')(environment, db)
  );

  // Old Panel
  app.get(
    '/panelOld',
    require('./panelOld/panelOld.js')(environment, db, templateToHtml)
  );

  app.post(
    '/panelOld/createGamePost',
    require('./panelOld/createGamePostOld.js')(environment, db, figureBlueprint)
  );

  app.post(
    '/panelOld/deleteGamePost',
    require('./panelOld/deleteGamePostOld.js')(environment, db)
  );

  app.post(
    '/panelOld/loadGamePost',
    require('./panelOld/loadGamePostOld.js')(environment, db)
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
    require('./ajax/launch/entities/launchEntitiesFilter.js')(),
    require('./ajax/world/entities/worldEntitiesFilter.js')(),
    require('./ajax/battle/entities/battleEntitiesFilter.js')(),
    require('./ajax/summary/entities/summaryEntitiesFilter.js')(),
    require('./ajax/battle/entities/unitAmountCensore.js')(),
    require('./ajax/common/entitiesFilterSendResponse.js')()
  );

  app.get(
    '/ajax/blueprint/blueprintGet',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./ajax/blueprint/blueprintGet.js')(
      unitBlueprint,
      figureBlueprint,
      raceBlueprint
    )
  );

  app.get(
    '/ajax/cheat/entities/cheatEntitiesGet',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./ajax/cheat/entities/cheatEntitiesGet.js')()
  );

  const saveGame = compose([
    require('./library/readEntities.js')(db),
    require('./ajax/saveLoad/saveGame.js')(db)
  ]);

  // launch
  app.post(
    '/ajax/launch/ready/playerReadyPost',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('launchState'),
    require('./ajax/launch/ready/playerReadyPost.js')(db),
    require('./library/readEntities.js')(db),
    require('./ajax/launch/ready/everyPlayerReadyChecker.js')(),
    require('./ajax/launch/ready/preparePlayerResource.js')(db, raceBlueprint),
    require('./ajax/launch/ready/prepareHeroFigure.js')(db, raceBlueprint),
    require('./ajax/launch/ready/launchCountdown.js')(db),
    require('./ajax/launch/ready/unsetReadyForLaunch.js')(db),
    saveGame
  );

  app.post(
    '/ajax/launch/name/playerNamePost',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('launchState'),
    require('./ajax/launch/name/playerNamePost.js')(db)
  );

  app.post(
    '/ajax/launch/race/playerRacePost',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('launchState'),
    require('./ajax/launch/race/playerRacePost.js')(db)
  );

  // world
  app.get(
    '/ajax/world/load/spriteFilenameArray',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./ajax/world/load/spriteFilenameArrayGet.js')(environment)
  );

  app.post(
    '/ajax/world/movement/pathPost',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('worldState'),
    require('./ajax/commonMovement/entityIdVerify.js')(),
    require('./ajax/commonMovement/flagIsProcessingInspect.js')(),
    require('./ajax/commonMovement/pathVerify.js')(),
    require('./ajax/world/movement/pathHeroMovementPointsSlice.js')(),
    require('./ajax/world/movement/pathIfBattleSlice.js')(),
    require('./ajax/world/movement/pathIfResourceSlice.js')(),
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
    require('./ajax/world/endTurn/createBattle.js')(db, unitBlueprint),
    require('./ajax/world/endTurn/newDay.js')(db),
    require('./ajax/world/endTurn/refillHeroMovement.js')(db),
    require('./ajax/world/endTurn/unsetEndTurnFlags.js')(db)
  );

  app.post(
    '/ajax/world/recruit/recruitUnitPost',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('worldState'),
    require('./ajax/world/recruit/recruitUnitPost.js')(db, unitBlueprint)
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
    maneuverDigest,
    saveGame
  );

  app.post(
    '/ajax/battle/wait/maneuverWait',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('battleState'),
    require('./ajax/battle/maneuver/maneuverSendResponse.js')(),
    maneuverVerify,
    require('./ajax/battle/wait/maneuverWait.js')(),
    maneuverDigest,
    saveGame
  );

  // summary
  app.post(
    '/ajax/summary/summaryConfirmPost',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('summaryState'),
    require('./ajax/summary/confirm/summaryConfirm.js')(db, raceBlueprint),
    require('./library/readEntities.js')(db),
    require('./ajax/summary/confirm/worldChecker.js')(db),
    require('./ajax/world/endTurn/battleChecker.js')(db),
    require('./ajax/world/endTurn/createBattle.js')(db, unitBlueprint),
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
