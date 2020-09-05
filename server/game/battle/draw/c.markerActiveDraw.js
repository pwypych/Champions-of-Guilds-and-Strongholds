// @format

'use strict';

g.autoload.markerActiveDraw = (inject) => {
  const viewport = inject.viewport;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'markerActiveDraw.js',
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
      const unitId = id;

      if (entity.unitStats && entity.active && entity.owner === playerId) {
        drawMarkerActive(unitId);
      } else {
        hideMarker(unitId);
      }
    });
  }

  function hideMarker(unitId) {
    const unitContainer = battleContainer.getChildByName(unitId);
    if (unitContainer) {
      const marker = unitContainer.getChildByName('markerActive');
      if (marker) {
        marker.visible = false;
      }
    }
  }

  function drawMarkerActive(unitId) {
    const unitContainer = battleContainer.getChildByName(unitId);

    if (!unitContainer) {
      return;
    }

    let marker = unitContainer.getChildByName('markerActive');

    // Should happen only once - memory leak danger!
    if (!marker) {
      // console.log('markerActiveDraw', unitId, 'marker');
      const textureName = 'markerActive';
      const texture = PIXI.loader.resources[textureName].texture;
      marker = new PIXI.Sprite(texture);
      marker.name = 'markerActive';
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
    const marker = unitContainer.getChildByName('markerActive');

    const animationTimeInSeconds = 0.5;

    TweenMax.to(marker, animationTimeInSeconds, {
      alpha: 0,
      repeat: -1,
      yoyo: true,
      ease: Power0.easeNone
    });
  }
};
