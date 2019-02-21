// @format

'use strict';

g.battle.drawActiveUnitMarker = (walkie, viewport, freshEntities) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onRecentManeuverDifferanceDone();
  })();

  function onRecentManeuverDifferanceDone() {
    walkie.onEvent(
      'recentManeuverDifferanceDone_',
      'drawActiveUnitMarker.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'battleState') {
          return;
        }

        forEachFigure();
      },
      false
    );
  }

  function forEachFigure() {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.unitName && entity.unitStats && entity.position) {
        drawActiveUnitMarker(entity, id);
      }
    });
  }

  function drawActiveUnitMarker(entity, unitId) {
    const name = 'activeUnitMarker_' + unitId;
    let marker;

    if (battleContainer.getChildByName(name)) {
      marker = battleContainer.getChildByName(name);
    }

    if (!battleContainer.getChildByName(name)) {
      console.log('drawActiveUnitMarker', name);
      const textureName = 'activeUnitMarker';
      const texture = PIXI.loader.resources[textureName].texture;
      marker = new PIXI.Sprite(texture);
      marker.name = name;
      marker.anchor = { x: 0, y: 1 };
      battleContainer.addChildZ(marker, 50);

      const offsetY = 2;
      marker.x = entity.position.x * blockWidthPx;
      marker.y = entity.position.y * blockHeightPx + blockHeightPx + offsetY;
    }

    if (entity.active) {
      marker.visible = true;
    } else {
      marker.visible = false;
    }
  }
};
