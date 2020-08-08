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
  const pathRead = path.join(environment.basepath, '/server/game/plugin/**/*.png');
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
  const hook = require('./library/hook.js')();

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

    setupBlueprint(hook);
  });
}

function setupBlueprint(hook) {
  require('./library/setupBlueprint.js')(hook, (error, blueprint) => {
    debug('setupBlueprint: blueprint:', _.size(blueprint));
    setupInstrumentRoutesAndLibraries(hook, blueprint);
  });
}

function setupInstrumentRoutesAndLibraries(hook, blueprint) {
  // libraries
  const templateToHtml = require('./library/templateToHtml.js')();

  // general
  app.get('/', (req, res) => {
    res.redirect('/panelRandom');
  });

  app.get(
    '/panelRandom',
    require('./instrument/panel/random/panelRandom.js')(environment, db, templateToHtml)
  );

  app.post(
    '/panelRandom/createGameRandomPost',
    require('./instrument/panel/random/generateMap/findLandByName.js')(db),
    require('./instrument/panel/random/generateMap/generateParcelCategoryExitList.js')(db),
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
    require('./instrument/panel/random/deleteGameRandomPost.js')(environment, db)
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
    require('./instrument/panel/predefined/deleteGamePredefinedPost.js')(environment, db)
  );

  app.post(
    '/panelPredefined/loadGamePost',
    require('./instrument/panel/predefined/loadGamePredefinedPost.js')(environment, db)
  );


  debug('setupInstrumentRoutesAndLibraries');
  setupGame(hook, blueprint);
}

function setupGame(hook, blueprint) {
  debug('setupGame');
  setupSpriteFilenameArray(hook, blueprint);
}

function setupSpriteFilenameArray(hook, blueprint) {
  require('./library/setupSpriteFilenameArray.js')(
    environment,
    (error, spriteFilenameArray) => {
      debug(
        'setupSpriteFilenameArray: Loaded sprites!',
        spriteFilenameArray.length
      );
      setupLibrariesAndRoutes(hook, blueprint, spriteFilenameArray);
    }
  );
}

// setup ejs files

// setup main game route

function setupLibrariesAndRoutes(hook, blueprint, spriteFilenameArray) {
  // libraries
  const templateToHtml = require('./library/templateToHtml.js')();

  app.get(
    '/game',
    require('./game/toSort/readEntities.js')(db),
    require('./game/toSort/middlewareTokenAuth.js')(),
    require('./game/game.js')(
      environment,
      db,
      blueprint,
      spriteFilenameArray,
      templateToHtml
    )
  );

  app.get(
    '/ajax/entitiesGet',
    require('./game/toSort/readEntities.js')(db),
    require('./game/toSort/middlewareTokenAuth.js')(),
    require('./game/ajax/launch/entities/launchEntitiesFilter.js')(),
    require('./game/ajax/world/entities/worldEntitiesFilter.js')(),
    require('./game/ajax/battle/entities/battleEntitiesFilter.js')(),
    require('./game/ajax/summary/entities/summaryEntitiesFilter.js')(),
    require('./game/ajax/common/entitiesFilterSendResponse.js')()
  );

  app.get(
    '/ajax/cheat/entities/cheatEntitiesGet',
    require('./game/toSort/readEntities.js')(db),
    require('./game/toSort/middlewareTokenAuth.js')(),
    require('./game/ajax/cheat/entities/cheatEntitiesGet.js')()
  );

  const saveGame = compose([
    require('./game/toSort/readEntities.js')(db),
    require('./game/ajax/saveLoad/saveGame.js')(db)
  ]);

  // launch
  app.post(
    '/ajax/launch/ready/playerReadyPost',
    require('./game/toSort/readEntities.js')(db),
    require('./game/toSort/middlewareTokenAuth.js')(),
    require('./game/toSort/middlewareAjaxStateAuth.js')('launchState'),
    require('./game/ajax/launch/ready/playerReadyPost.js')(db),
    require('./game/toSort/readEntities.js')(db),
    require('./game/ajax/launch/ready/everyPlayerReadyChecker.js')(),
    require('./game/ajax/launch/ready/preparePlayerResource.js')(db, blueprint),
    require('./game/ajax/launch/ready/prepareHeroFigure.js')(db, blueprint),
    require('./game/ajax/launch/ready/launchCountdown.js')(db),
    require('./game/ajax/launch/ready/unsetReadyForLaunch.js')(db),
    saveGame
  );

  app.post(
    '/ajax/launch/name/playerNamePost',
    require('./game/toSort/readEntities.js')(db),
    require('./game/toSort/middlewareTokenAuth.js')(),
    require('./game/toSort/middlewareAjaxStateAuth.js')('launchState'),
    require('./game/ajax/launch/name/playerNamePost.js')(db)
  );

  app.post(
    '/ajax/launch/race/playerRacePost',
    require('./game/toSort/readEntities.js')(db),
    require('./game/toSort/middlewareTokenAuth.js')(),
    require('./game/toSort/middlewareAjaxStateAuth.js')('launchState'),
    require('./game/ajax/launch/race/playerRacePost.js')(db)
  );

  app.post(
    '/ajax/world/movement/pathPost',
    require('./game/toSort/readEntities.js')(db),
    require('./game/toSort/middlewareTokenAuth.js')(),
    require('./game/toSort/middlewareAjaxStateAuth.js')('worldState'),
    require('./game/ajax/commonMovement/entityIdVerify.js')(),
    require('./game/ajax/commonMovement/flagIsProcessingInspect.js')(),
    require('./game/ajax/commonMovement/pathVerify.js')(),
    require('./game/ajax/world/movement/pathHeroMovementPointsSlice.js')(),
    require('./game/ajax/world/movement/pathIfBattleSlice.js')(),
    require('./game/ajax/world/movement/pathIfResourceSlice.js')(),
    require('./game/ajax/world/movement/pathCollisionInWorldVerify.js')(),
    require('./game/ajax/world/movement/heroMovementPointsDecrement.js')(db),
    require('./game/ajax/commonMovement/flagIsProcessingCreate.js')(db),
    require('./game/ajax/commonMovement/recentActivityOnMovement.js')(db),
    require('./game/ajax/commonMovement/pathSendResponse.js')(),
    require('./game/ajax/commonMovement/movementTimeout.js')(),
    require('./game/ajax/commonMovement/positionUpdate.js')(db),
    require('./game/ajax/world/movement/collectResource.js')(db),
    require('./game/ajax/world/movement/battleNpcInitiate.js')(db),
    require('./game/ajax/world/movement/battleClashInitiate.js')(db),
    saveGame
  );

  app.post(
    '/ajax/world/endTurn/endTurnPost',
    require('./game/toSort/readEntities.js')(db),
    require('./game/toSort/middlewareTokenAuth.js')(),
    require('./game/toSort/middlewareAjaxStateAuth.js')('worldState'),
    require('./game/ajax/world/endTurn/endTurnPost.js')(db),
    require('./game/ajax/world/endTurn/zeroHeroMovementPoints.js')(db),
    require('./game/ajax/world/endTurn/endTurnCountdown.js')(
      db
    ),
    require('./game/toSort/readEntities.js')(db),
    require('./game/ajax/world/endTurn/battleChecker.js')(db),
    require('./game/ajax/world/endTurn/battleNpcCreate.js')(db, blueprint),
    require('./game/ajax/world/endTurn/battleClashCreate.js')(db, blueprint),
    require('./game/ajax/world/endTurn/newDay.js')(db),
    // require('./game/toSort/readEntities.js')(db),
    require('./game/ajax/world/endTurn/enchantmentIncomeExecutor.js')(db),
    require('./game/ajax/world/endTurn/refillHeroMovement.js')(db),
    require('./game/ajax/world/endTurn/unsetEndTurnFlags.js')(db)
  );

  app.post(
    '/ajax/world/recruit/recruitUnitPost',
    require('./game/toSort/readEntities.js')(db),
    require('./game/toSort/middlewareTokenAuth.js')(),
    require('./game/toSort/middlewareAjaxStateAuth.js')('worldState'),
    require('./game/ajax/world/recruit/recruitUnitPost.js')(db, blueprint)
  );

  app.post(
    '/ajax/world/build/buildFortificationPost',
    require('./game/toSort/readEntities.js')(db),
    require('./game/toSort/middlewareTokenAuth.js')(),
    require('./game/toSort/middlewareAjaxStateAuth.js')('worldState'),
    require('./game/ajax/world/build/buildFortificationPost.js')(db, blueprint)
  );

  // battle
  const maneuverVerify = compose([
    require('./game/toSort/readEntities.js')(db),
    require('./game/ajax/commonMovement/entityIdVerify.js')(),
    require('./game/ajax/battle/maneuver/verify/checkUnitOwner.js')(),
    require('./game/ajax/battle/maneuver/verify/checkUnitActive.js')(),
    require('./game/ajax/battle/maneuver/verify/checkUnitManeuverGreatherThenZero.js')()
  ]);

  const maneuverDigest = compose([
    require('./game/toSort/readEntities.js')(db),
    require('./game/ajax/battle/maneuver/digest/decrementUnitManeuver.js')(db),
    require('./game/ajax/battle/maneuver/digest/ifBattleFinishedChangeState.js')(db),
    require('./game/toSort/readEntities.js')(db),
    require('./game/ajax/battle/maneuver/verify/checkIsUnitManeuverZero.js')(),
    require('./game/ajax/battle/maneuver/verify/ifEveryUnitManeuverZeroRefill.js')(
      db
    ),
    require('./game/toSort/readEntities.js')(db),
    require('./game/ajax/battle/maneuver/digest/nominateNewActiveUnit.js')(db)
  ]);

  app.post(
    '/ajax/battle/movement/pathPost',
    require('./game/toSort/readEntities.js')(db),
    require('./game/toSort/middlewareTokenAuth.js')(),
    require('./game/toSort/middlewareAjaxStateAuth.js')('battleState'),
    maneuverVerify,
    require('./game/ajax/commonMovement/flagIsProcessingInspect.js')(),
    require('./game/ajax/commonMovement/pathVerify.js')(),
    require('./game/ajax/battle/movement/pathUnitMovementPointsVerify.js')(),
    require('./game/ajax/battle/movement/walkPathInBattleVerify.js')(),
    require('./game/ajax/battle/movement/flyPathInBattleVerify.js')(),
    require('./game/ajax/battle/movement/isUnitRetreatFromEnemy.js')(),
    require('./game/ajax/commonMovement/flagIsProcessingCreate.js')(db),
    require('./game/ajax/commonMovement/recentActivityOnMovement.js')(db),
    require('./game/ajax/commonMovement/pathSendResponse.js')(),
    require('./game/ajax/commonMovement/movementTimeout.js')(),
    require('./game/ajax/commonMovement/positionUpdate.js')(db),
    maneuverDigest,
    saveGame
  );

  app.post(
    '/ajax/battle/melee/maneuverMeleePost',
    require('./game/toSort/readEntities.js')(db),
    require('./game/toSort/middlewareTokenAuth.js')(),
    require('./game/toSort/middlewareAjaxStateAuth.js')('battleState'),
    require('./game/ajax/battle/response/sendResponseEarly.js')(),
    maneuverVerify,
    require('./game/ajax/battle/melee/maneuverMelee.js')(db),
    maneuverDigest,
    saveGame
  );

  app.post(
    '/ajax/battle/shoot/maneuverShootPost',
    require('./game/toSort/readEntities.js')(db),
    require('./game/toSort/middlewareTokenAuth.js')(),
    require('./game/toSort/middlewareAjaxStateAuth.js')('battleState'),
    require('./game/ajax/battle/response/sendResponseEarly.js')(),
    maneuverVerify,
    require('./game/ajax/battle/shoot/maneuverShoot.js')(db),
    maneuverDigest,
    saveGame
  );

  app.post(
    '/ajax/battle/wait/maneuverWait',
    require('./game/toSort/readEntities.js')(db),
    require('./game/toSort/middlewareTokenAuth.js')(),
    require('./game/toSort/middlewareAjaxStateAuth.js')('battleState'),
    require('./game/ajax/battle/response/sendResponseEarly.js')(),
    maneuverVerify,
    require('./game/ajax/battle/wait/maneuverWait.js')(),
    maneuverDigest,
    saveGame
  );

  app.post(
    '/ajax/battle/activate/activateUnitPost',
    require('./game/toSort/readEntities.js')(db),
    require('./game/toSort/middlewareTokenAuth.js')(),
    require('./game/toSort/middlewareAjaxStateAuth.js')('battleState'),
    require('./game/toSort/readEntities.js')(db),
    require('./game/ajax/commonMovement/entityIdVerify.js')(),
    require('./game/ajax/battle/maneuver/verify/checkUnitOwner.js')(),
    require('./game/ajax/battle/response/sendResponseEarly.js')(),
    require('./game/ajax/battle/activate/activateUnit.js')(db)
  );

  // summary
  app.post(
    '/ajax/summary/summaryConfirmPost',
    require('./game/toSort/readEntities.js')(db),
    require('./game/toSort/middlewareTokenAuth.js')(),
    require('./game/toSort/middlewareAjaxStateAuth.js')('summaryState'),
    require('./game/ajax/summary/confirm/summaryConfirm.js')(db, blueprint),
    require('./game/toSort/readEntities.js')(db),
    require('./game/ajax/summary/confirm/worldChecker.js')(db),
    require('./game/ajax/world/endTurn/battleChecker.js')(db),
    require('./game/ajax/world/endTurn/battleNpcCreate.js')(db, blueprint),
    require('./game/ajax/world/endTurn/battleClashCreate.js')(db, blueprint),
    require('./game/ajax/world/endTurn/newDay.js')(db),
    require('./game/ajax/world/endTurn/refillHeroMovement.js')(db),
    require('./game/ajax/world/endTurn/unsetEndTurnFlags.js')(db)
  );

  debug('setupLibrariesAndRoutes()');
  setupExpress();
}

function setupExpress() {
  debug('setupExpress()');
  debug('******************** start ********************');
  app.listen(3000);
}
