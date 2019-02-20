// @format

'use strict';

g.battle.drawUnits = (walkie, auth, viewport, freshEntities) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'recentManeuverDifferanceDone_',
      'drawUnits.js',
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
      if (entity.unitName && entity.position) {
        instantiateOrFindSprite(entity, id);
      }
    });
  }

  function instantiateOrFindSprite(entity, id) {
    let sprite;

    if (battleContainer.getChildByName(id)) {
      sprite = battleContainer.getChildByName(id);
    }

    if (!battleContainer.getChildByName(id)) {
      // console.log('drawUnit', id);
      const texture = PIXI.loader.resources[entity.unitName].texture;
      sprite = new PIXI.Sprite(texture);
      sprite.name = id;
      const zIndex = 100 + entity.position.y;
      battleContainer.addChildZ(sprite, zIndex);
      updatePosition(entity, sprite);
    }
  }

  function updatePosition(entity, sprite) {
    sprite.anchor = { x: 0, y: 1 };
    sprite.x = entity.position.x * blockWidthPx;
    sprite.y = entity.position.y * blockHeightPx + blockHeightPx;

    if (entity.spriteOffset) {
      sprite.x += entity.spriteOffset.x;
      sprite.y += entity.spriteOffset.y;
    }
  }
};
