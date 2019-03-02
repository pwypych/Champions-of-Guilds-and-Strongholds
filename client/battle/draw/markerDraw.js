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
        findPlayerUnitIds(playerId);
      }
    });
  }

  function findPlayerUnitIds(playerId) {
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
        const textureName = 'markerGreenO';
        const texture = PIXI.loader.resources[textureName].texture;
        marker = new PIXI.Sprite(texture);
        marker.name = 'marker';
        unitContainer.addChild(marker);

        const offsetY = 2;
        marker.x = 0;
        marker.y = offsetY;
      }
    });

    findNPCUnitIds(boss, playerId);
  }

  function findNPCUnitIds(boss, playerId) {
    const nPCUnitIds = [];
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.boss === boss && entity.owner !== playerId) {
        nPCUnitIds.push(id);
      }
    });

    drawMarkerGrey(nPCUnitIds, boss);
  }

  function drawMarkerGrey(nPCUnitIds, boss) {
    _.forEach(nPCUnitIds, (unitId) => {
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

    findEnemyUnitIds(boss);
  }

  function findEnemyUnitIds(boss) {
    const enemyUnitIds = [];
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.unitStats && entity.boss !== boss) {
        enemyUnitIds.push(id);
      }
    });

    drawMarkerRed(enemyUnitIds);
  }

  function drawMarkerRed(enemyUnitIds) {
    _.forEach(enemyUnitIds, (unitId) => {
      const unitContainer = battleContainer.getChildByName(unitId);
      let marker = unitContainer.getChildByName('marker');

      // Should happen only once - memory leak danger!
      if (!marker) {
        // console.log('markerDraw', unitId, 'marker');
        const textureName = 'markerRedO';
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
