// @format

'use strict';

// What does this module do?
// Draws marker with blink for active enemy unit hide it for all other units
g.autoload.markerActiveEnemyDraw = (inject) => {
  const viewport = inject.viewport;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGetEvent_',
      'markerActiveEnemyDraw.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'battleState') {
          return;
        }

        findPlayerId();
      },
      false
    );
  }

  function findPlayerId() {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.playerCurrent) {
        const playerId = id;
        findActiveUnit(playerId);
      }
    });
  }

  function findActiveUnit(playerId) {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.unitStats) {
        const unitId = id;

        if (entity.active && entity.owner !== playerId) {
          drawMarkerActiveEnemy(unitId);
        } else {
          hideMarker(unitId);
        }
      }
    });
  }

  function hideMarker(unitId) {
    const unitContainer = battleContainer.getChildByName(unitId);
    if (unitContainer) {
      const marker = unitContainer.getChildByName('markerActiveEnemy');
      if (marker) {
        marker.visible = false;
      }
    }
  }

  function drawMarkerActiveEnemy(unitId) {
    const unitContainer = battleContainer.getChildByName(unitId);

    if (!unitContainer) {
      return;
    }

    let marker = unitContainer.getChildByName('markerActiveEnemy');

    // Should happen only once - memory leak danger!
    if (!marker) {
      // console.log('markerActiveEnemyDraw', unitId, 'marker');
      const textureName = 'markerActiveEnemy';
      const texture = PIXI.loader.resources[textureName].texture;
      marker = new PIXI.Sprite(texture);
      marker.name = 'markerActiveEnemy';
      const zOrder = 1;
      unitContainer.addChildZ(marker, zOrder);
      unitContainer.sortChildren();

      marker.x = 0;
      marker.y = 32 - marker.height;
      turnBlinkOn(unitId);
    }

    marker.visible = true;
  }

  function turnBlinkOn(unitId) {
    const unitContainer = battleContainer.getChildByName(unitId);
    const marker = unitContainer.getChildByName('markerActiveEnemy');

    const animationTimeInSeconds = 0.5;

    TweenMax.to(marker, animationTimeInSeconds, {
      alpha: 0,
      repeat: -1,
      yoyo: true,
      ease: Power0.easeNone
    });
  }
};
