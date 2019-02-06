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

  // general endpoints
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
    require('./ajax/battle/entities/battleEntitiesGet.js')()
  );

  // launchState endpoints
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

  // worldState
  app.get(
    '/ajax/world/load/spriteFilenameArray',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./ajax/world/load/spriteFilenameArrayGet.js')(environment)
  );

  const updateHeroPosition = require('./ajax/world/journey/updateHeroPosition.js')(
    db
  );
  const collectResource = require('./ajax/world/journey/collectResource.js')(
    db
  );
  const prepareHeroForBattle = require('./ajax/world/journey/prepareHeroForBattle.js')(
    db
  );
  const decideHeroStep = require('./ajax/world/journey/decideHeroStep.js')(
    db,
    findEntitiesByGameId,
    updateHeroPosition,
    collectResource,
    prepareHeroForBattle
  );
  app.post(
    '/ajax/world/journey/heroJourneyPost',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('worldState'),
    require('./ajax/world/journey/heroJourneyPost.js')(),
    require('./ajax/world/journey/checkHeroOwner.js')(),
    require('./ajax/world/journey/processHeroJourney.js')(db, decideHeroStep)
  );

  app.post(
    '/ajax/world/journey/heroJourneyCancelPost',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('worldState'),
    require('./ajax/world/journey/heroJourneyCancelPost.js')(db)
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
    require('./ajax/world/endTurn/battleChecker.js')(db),
    require('./ajax/world/endTurn/createBattle.js')(db, unitStats),
    require('./ajax/world/endTurn/newDay.js')(db),
    require('./ajax/world/endTurn/refillHeroMovement.js')(db),
    require('./ajax/world/endTurn/unsetEndTurnFlags.js')(db)
  );

  // battleState
  const checkUnitActive = require('./ajax/battle/maneuver/verify/checkUnitActive.js')(
    findEntitiesByGameId
  );
  const checkUnitOwner = require('./ajax/battle/maneuver/verify/checkUnitOwner.js')(
    findEntitiesByGameId
  );
  const checkUnitManeuverGreatherThenZero = require('./ajax/battle/maneuver/verify/checkUnitManeuverGreatherThenZero.js')(
    findEntitiesByGameId
  );
  const verifyManeuverMiddleware = require('./ajax/battle/maneuver/verify/verifyManeuver.js')(
    checkUnitOwner,
    checkUnitActive,
    checkUnitManeuverGreatherThenZero
  );

  const decrementUnitManeuver = require('./ajax/battle/maneuver/digest/decrementUnitManeuver.js')(
    db
  );
  const checkIsUnitManeuverZero = require('./ajax/battle/maneuver/verify/checkIsUnitManeuverZero.js')(
    db,
    findEntitiesByGameId
  );
  const checkIsEveryUnitManeuverZero = require('./ajax/battle/maneuver/verify/checkIsEveryUnitManeuverZero.js')(
    db,
    findEntitiesByGameId
  );
  const refillEveryUnitManeuver = require('./ajax/battle/maneuver/digest/refillEveryUnitManeuver.js')(
    db,
    findEntitiesByGameId
  );
  const nominateNewActiveUnit = require('./ajax/battle/maneuver/digest/nominateNewActiveUnit.js')(
    db,
    findEntitiesByGameId
  );
  const ifBattleFinishedChangeBattleStatus = require('./ajax/battle/maneuver/digest/ifBattleFinishedChangeBattleStatus.js')(
    findEntitiesByGameId,
    db
  );
  const digestFinishedManeuverMiddleware = require('./ajax/battle/maneuver/digest/digestFinishedManeuver.js')(
    db,
    decrementUnitManeuver,
    checkIsUnitManeuverZero,
    checkIsEveryUnitManeuverZero,
    refillEveryUnitManeuver,
    nominateNewActiveUnit,
    ifBattleFinishedChangeBattleStatus
  );

  const updateUnitPosition = require('./ajax/battle/unitJourney/updateUnitPosition.js')(
    db
  );
  const updateUnitRecentManeuver = require('./ajax/battle/maneuver/updateUnitRecentManeuver.js')(
    db
  );
  const decrementUnitMovement = require('./ajax/battle/unitJourney/decrementUnitMovement.js')(
    db
  );
  const decideUnitStep = require('./ajax/battle/unitJourney/decideUnitStep.js')(
    db,
    findEntitiesByGameId,
    decrementUnitMovement,
    updateUnitPosition,
    updateUnitRecentManeuver
  );
  const refillUnitMovement = require('./ajax/battle/unitJourney/refillUnitMovement.js')(
    db,
    findEntitiesByGameId
  );
  app.post(
    '/ajax/battle/unitJourney/maneuverJourneyPost',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('battleState'),
    require('./ajax/battle/maneuver/maneuverPost.js')(),
    verifyManeuverMiddleware,
    require('./ajax/battle/unitJourney/maneuverJourney.js')(
      db,
      decideUnitStep,
      refillUnitMovement
    ),
    digestFinishedManeuverMiddleware
  );

  app.post(
    '/ajax/battle/melee/maneuverMeleePost',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('battleState'),
    require('./ajax/battle/maneuver/maneuverPost.js')(),
    verifyManeuverMiddleware,
    // tu ma być melee middleware
    require('./ajax/battle/melee/maneuverMelee.js')(db),
    digestFinishedManeuverMiddleware
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
