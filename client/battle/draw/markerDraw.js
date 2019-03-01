// @format

'use strict';

g.battle.markerDraw = (walkie, auth, viewport, freshEntities) => {
  let isDone = false;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onRecentActivityDifferanceDone();
  })();

  function onRecentActivityDifferanceDone() {
    walkie.onEvent(
      'entitiesGet_',
      'markerDraw.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'battleState') {
          return;
        }

        checkIsDone();
      },
      false
    );
  }

  function checkIsDone() {
    if (isDone) {
      return;
    }

    findPlayerCurrent();
  }

  function findPlayerCurrent() {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.playerCurrent) {
        const playerId = id;
        findPlayerUnits(playerId);
      }
    });
  }

  function findPlayerUnits(playerId) {
    const playerUnits = [];
    let playerBoss;
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.owner === playerId) {
        playerUnits.push(id);
        playerBoss = entity.boss;
      }
    });

    drawMarkerGreen(playerUnits, playerBoss, playerId);
  }

  function drawMarkerGreen(playerUnits, playerBoss, playerId) {
    _.forEach(playerUnits, (unitId) => {
      const unitContainer = battleContainer.getChildByName(unitId);
      let marker = unitContainer.getChildByName('marker');

      // Should happen only once - memory leak danger!
      if (!marker) {
        // console.log('markerDraw', unitId, 'marker');
        const textureName = 'markerGreen';
        const texture = PIXI.loader.resources[textureName].texture;
        marker = new PIXI.Sprite(texture);
        marker.name = 'marker';
        unitContainer.addChild(marker);

        const offsetY = 2;
        marker.x = 0;
        marker.y = offsetY;
      }
    });

    findNPCUnits(playerBoss, playerId);
  }

  function findNPCUnits(playerBoss, playerId) {
    const nPCUnits = [];
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.boss === playerBoss && entity.owner !== playerId) {
        nPCUnits.push(id);
      }
    });

    console.log('nPCUnits.length:', nPCUnits.length);
    drawMarkerGrey(nPCUnits, playerBoss);
  }

  function drawMarkerGrey(nPCUnits, playerBoss) {
    _.forEach(nPCUnits, (unitId) => {
      const unitContainer = battleContainer.getChildByName(unitId);
      let marker = unitContainer.getChildByName('marker');

      // Should happen only once - memory leak danger!
      if (!marker) {
        // console.log('markerDraw', unitId, 'marker');
        const textureName = 'markerGrey';
        const texture = PIXI.loader.resources[textureName].texture;
        marker = new PIXI.Sprite(texture);
        marker.name = 'marker';
        unitContainer.addChild(marker);

        const offsetY = 2;
        marker.x = 0;
        marker.y = offsetY;
      }
    });

    findEnemyUnits(playerBoss);
  }

  function findEnemyUnits(playerBoss) {
    const enemyUnits = [];
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.unitStats && entity.boss !== playerBoss) {
        enemyUnits.push(id);
        console.log('id:', id);
      }
    });

    console.log('enemyUnits.length:', enemyUnits.length);
    drawMarkerRed(enemyUnits);
  }

  function drawMarkerRed(enemyUnits) {
    _.forEach(enemyUnits, (unitId) => {
      const unitContainer = battleContainer.getChildByName(unitId);
      let marker = unitContainer.getChildByName('marker');

      // Should happen only once - memory leak danger!
      if (!marker) {
        // console.log('markerDraw', unitId, 'marker');
        const textureName = 'markerRed';
        const texture = PIXI.loader.resources[textureName].texture;
        marker = new PIXI.Sprite(texture);
        marker.name = 'marker';
        unitContainer.addChild(marker);

        const offsetY = 2;
        marker.x = 0;
        marker.y = offsetY;
      }
    });

    isDone = true;
  }
};
