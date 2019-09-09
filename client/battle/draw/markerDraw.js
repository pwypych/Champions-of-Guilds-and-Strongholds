// @format

'use strict';

g.battle.markerDraw = (walkie, viewport, freshEntities) => {
  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'viewportBattleReady_',
      'markerDraw.js',
      () => {
        findPlayerId();
      },
      false
    );
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
      if (entity.owner === playerId && !entity.dead) {
        unitIds.push(id);
      }
    });

    const unitId = unitIds[0];
    const boss = freshEntities()[unitId].boss;
    drawMarkerPlayerUnits(unitIds, boss, playerId);
  }

  function drawMarkerPlayerUnits(unitIds, boss, playerId) {
    _.forEach(unitIds, (unitId) => {
      const unitContainer = battleContainer.getChildByName(unitId);
      let marker = unitContainer.getChildByName('marker');

      // Should happen only once - memory leak danger!
      if (!marker) {
        // console.log('markerDraw', unitId, 'marker');
        const textureName = 'markerShield';
        const texture = PIXI.loader.resources[textureName].texture;
        marker = new PIXI.Sprite(texture);
        marker.name = 'marker';
        const zOrder = 10;
        unitContainer.addChildZ(marker, zOrder);
        unitContainer.sortChildren();

        marker.x = 0;
        marker.y = 32 - marker.height;
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

    drawMarkerNPC(nPCUnitIds, boss);
  }

  function drawMarkerNPC(nPCUnitIds, boss) {
    _.forEach(nPCUnitIds, (unitId) => {
      const unitContainer = battleContainer.getChildByName(unitId);
      let marker = unitContainer.getChildByName('marker');

      // Should happen only once - memory leak danger!
      if (!marker) {
        // console.log('markerDraw', unitId, 'marker');
        const textureName = 'markerSkullDark';
        const texture = PIXI.loader.resources[textureName].texture;
        marker = new PIXI.Sprite(texture);
        marker.name = 'marker';
        const zOrder = 10;
        unitContainer.addChildZ(marker, zOrder);
        unitContainer.sortChildren();

        marker.x = 0;
        marker.y = 32 - marker.height;
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

    drawMarkerEnemy(enemyUnitIds);
  }

  function drawMarkerEnemy(enemyUnitIds) {
    _.forEach(enemyUnitIds, (unitId) => {
      const unitContainer = battleContainer.getChildByName(unitId);
      let marker = unitContainer.getChildByName('marker');

      // Should happen only once - memory leak danger!
      if (!marker) {
        // console.log('markerDraw', unitId, 'marker');
        const textureName = 'markerSkull';
        const texture = PIXI.loader.resources[textureName].texture;
        marker = new PIXI.Sprite(texture);
        marker.name = 'marker';
        const zOrder = 10;
        unitContainer.addChildZ(marker, zOrder);
        unitContainer.sortChildren();

        marker.x = 0;
        marker.y = 32 - marker.height;
      }
    });
  }
};
