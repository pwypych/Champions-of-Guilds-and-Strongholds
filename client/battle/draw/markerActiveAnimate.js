// @format

'use strict';

g.battle.markerActiveAnimate = (walkie, viewport, freshEntities) => {
  const battleContainer = viewport.getChildByName('battleContainer');

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

        findActiveUnit();
      },
      false
    );
  }

  function findActiveUnit() {
    _.forEach(freshEntities(), (entity, id) => {
      const unitId = id;

      if (entity.unitStats && entity.active) {
        drawMarkerActive(unitId);
      } else {
        hideMarker(unitId);
      }
    });
  }

  function hideMarker(unitId) {
    const unitContainer = battleContainer.getChildByName(unitId);
    if (unitContainer) {
      const marker = unitContainer.getChildByName('activeMarker');
      if (marker) {
        marker.visible = false;
      }
    }
  }

  function drawMarkerActive(unitId) {
    const unitContainer = battleContainer.getChildByName(unitId);
    let marker = unitContainer.getChildByName('activeMarker');

    // Should happen only once - memory leak danger!
    if (!marker) {
      // console.log('markerDraw', unitId, 'marker');
      const textureName = 'markerActive';
      const texture = PIXI.loader.resources[textureName].texture;
      marker = new PIXI.Sprite(texture);
      marker.name = 'activeMarker';
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
    const marker = unitContainer.getChildByName('activeMarker');

    const animationTimeInSeconds = 0.5;

    TweenMax.to(marker, animationTimeInSeconds, {
      alpha: 0,
      repeat: -1,
      yoyo: true,
      ease: Power0.easeNone
    });
  }
};
