// @format

'use strict';

g.battle.markerDraw = (walkie, viewport, freshEntities) => {
  const battleContainer = viewport.getChildByName('battleContainer');

  let isDone = false;

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
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

    findPlayerId();
  }

  function findPlayerId() {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.playerCurrent) {
        const playerId = id;
        findPlayerUnits(playerId);
      }
    });
  }

  function findPlayerUnits(playerId) {
    const unitIds = [];
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.owner === playerId) {
        unitIds.push(id);
      }
    });

    const unitId = unitIds[0];
    const boss = freshEntities()[unitId].boss;
    drawMarkerGreen(unitIds, boss, playerId);
  }

  function drawMarkerGreen(unitIds, boss, playerId) {
    _.forEach(unitIds, (unitId) => {
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

    findNPCUnits(boss, playerId);
  }

  function findNPCUnits(boss, playerId) {
    const nPCUnits = [];
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.boss === boss && entity.owner !== playerId) {
        nPCUnits.push(id);
      }
    });

    drawMarkerGrey(nPCUnits, boss);
  }

  function drawMarkerGrey(nPCUnits, boss) {
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

    findEnemyUnits(boss);
  }

  function findEnemyUnits(boss) {
    const enemyUnits = [];
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.unitStats && entity.boss !== boss) {
        enemyUnits.push(id);
        console.log('id:', id);
      }
    });

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
