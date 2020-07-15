// @format

'use strict';

// External libraries
const debug = require('debug')('cogs:app');
const glob = require('glob');
const fs = require('fs');
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
  const pathRead = path.join(environment.basepath, '/server/plugin/**/*.png');
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
    setupLocals();
  });
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

  mongodb.connect(connectionUrl, options, (error, client) => {
    db = client.db(dbName);

    debug('setupMongo()');
    setupPredefinedMapCollection();
  });
}

function setupPredefinedMapCollection() {
  const generateMapCollection = require('./library/generatePredefinedMapCollection.js')(
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
  const generateParcelCollection = require('./library/generateParcelCollection.js')(
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
  const generateLandCollection = require('./library/generateLandCollection.js')(
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
  const hook = require('./core/hook.js')();

  const pathRead = path.join(environment.basepath, '/server/plugin/**/*.hook.js');
  glob(pathRead, {}, (error, pathFiles) => {
    if (error) {
      debug('setupHooks: error:', error);
      return;
    }

    pathFiles.forEach((pathFile) => {
      require(pathFile)(hook);

      const fileName = path.basename(pathFile);
      debug('setupHooks: fileName:', fileName);
    });

    setupLibrariesAndRoutes(hook);
  });
}

function setupLibrariesAndRoutes(hook) {
  // libraries
  const templateToHtml = require('./library/templateToHtml.js')();
  const findEntitiesByGameId = require('./library/findEntitiesByGameId.js')(db);

  const unitBlueprint = require('./ajax/blueprint/unitBlueprint.js');
  const figureBlueprint = require('./ajax/blueprint/figureBlueprint.js');
  const raceBlueprint = require('./ajax/blueprint/raceBlueprint.js');
  const buildingBlueprint = require('./ajax/blueprint/buildingBlueprint.js');

  // general
  app.get('/', (req, res) => {
    res.redirect('/panelRandom');
  });

  app.get(
    '/panelRandom',
    require('./panel/random/panelRandom.js')(environment, db, templateToHtml)
  );

  app.post(
    '/panelRandom/createGameRandomPost',
    require('./panel/random/generateMap/findLandByName.js')(db),
    require('./panel/random/generateMap/generateParcelCategoryExitList.js')(db),
    require('./panel/random/generateMap/generateParcelMap.js')(),
    require('./panel/random/generateMap/generateAbstractFigureMap.js')(),
    require('./panel/random/generateMap/generateFigureMap.js')(
      environment,
      unitBlueprint
    ),
    require('./panel/random/generateMap/addMonsterToFigureMap.js')(
      environment,
      unitBlueprint
    ),
    require('./panel/random/generateMap/addBarrierToFigureMap.js')(),
    require('./panel/random/generateMap/addTreasureToFigureMap.js')(),
    require('./panel/random/generateMap/addNonAbstractToFgureMap.js')(),
    require('./panel/random/createGameRandomPost.js')(
      environment,
      db,
      hook
    )
  );

  app.post(
    '/panelRandom/deleteGameRandomPost',
    require('./panel/random/deleteGameRandomPost.js')(environment, db)
  );

  app.post(
    '/panelRandom/loadGamePost',
    require('./panel/random/loadGamePost.js')(environment, db)
  );

  // Old Panel
  app.get(
    '/panelPredefined',
    require('./panel/predefined/panelPredefined.js')(
      environment,
      db,
      templateToHtml
    )
  );

  app.post(
    '/panelPredefined/createGamePredefinedPost',
    require('./panel/predefined/createGamePredefinedPost.js')(
      environment,
      db,
      hook
    )
  );

  app.post(
    '/panelPredefined/deleteGamePredefinedPost',
    require('./panel/predefined/deleteGamePredefinedPost.js')(environment, db)
  );

  app.post(
    '/panelPredefined/loadGamePost',
    require('./panel/predefined/loadGamePredefinedPost.js')(environment, db)
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
    require('./ajax/common/entitiesFilterSendResponse.js')()
  );

  app.get(
    '/ajax/blueprint/blueprintGet',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./ajax/blueprint/blueprintGet.js')(
      unitBlueprint,
      figureBlueprint,
      raceBlueprint,
      buildingBlueprint
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
    require('./ajax/world/movement/battleNpcInitiate.js')(db),
    require('./ajax/world/movement/battleClashInitiate.js')(db),
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
    require('./ajax/world/endTurn/battleNpcCreate.js')(db, unitBlueprint),
    require('./ajax/world/endTurn/battleClashCreate.js')(db, unitBlueprint),
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

  app.post(
    '/ajax/world/build/buildCastleBuildingPost',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('worldState'),
    require('./ajax/world/build/buildCastleBuildingPost.js')(db)
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
    require('./ajax/battle/movement/walkPathInBattleVerify.js')(),
    require('./ajax/battle/movement/flyPathInBattleVerify.js')(),
    require('./ajax/battle/movement/isUnitRetreatFromEnemy.js')(),
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
    require('./ajax/battle/response/sendResponseEarly.js')(),
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
    require('./ajax/battle/response/sendResponseEarly.js')(),
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
    require('./ajax/battle/response/sendResponseEarly.js')(),
    maneuverVerify,
    require('./ajax/battle/wait/maneuverWait.js')(),
    maneuverDigest,
    saveGame
  );

  app.post(
    '/ajax/battle/activate/activateUnitPost',
    require('./library/readEntities.js')(db),
    require('./library/middlewareTokenAuth.js')(),
    require('./library/middlewareAjaxStateAuth.js')('battleState'),
    require('./library/readEntities.js')(db),
    require('./ajax/commonMovement/entityIdVerify.js')(),
    require('./ajax/battle/maneuver/verify/checkUnitOwner.js')(),
    require('./ajax/battle/response/sendResponseEarly.js')(),
    require('./ajax/battle/activate/activateUnit.js')(db)
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
    require('./ajax/world/endTurn/battleNpcCreate.js')(db, unitBlueprint),
    require('./ajax/world/endTurn/battleClashCreate.js')(db, unitBlueprint),
    require('./ajax/world/endTurn/newDay.js')(db),
    require('./ajax/world/endTurn/refillHeroMovement.js')(db),
    require('./ajax/world/endTurn/unsetEndTurnFlags.js')(db)
  );

  debug('setupLibrariesAndRoutes()');
  setupExpress();
}

function setupExpress() {
  debug('setupExpress()');
  debug('******************** start ********************');
  app.listen(3000);
}
