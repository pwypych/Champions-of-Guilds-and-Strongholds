// @format

'use strict';

g.world.drawFigures = (walkie, auth, viewport, freshEntities) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const worldContainer = viewport.getChildByName('worldContainer');

  (function init() {
    onRecentActivityDifferanceDone();
  })();

  function onRecentActivityDifferanceDone() {
    walkie.onEvent(
      'recentActivityDifferanceDone_',
      'drawFigures.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'worldState') {
          return;
        }

        forEachFigure();
      },
      false
    );
  }

  function forEachFigure() {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.figureName && entity.position) {
        instantiateFigureContainer(entity, id);
      }
    });
  }

  function instantiateFigureContainer(entity, figureId) {
    let figureContainer = worldContainer.getChildByName(figureId);

    if (!figureContainer) {
      // Should happen only once
      // console.log('drawFigures: figure container', id);
      figureContainer = new PIXI.Container();
      figureContainer.name = figureId;
      const zIndex = 100 + entity.position.y;
      worldContainer.addChildZ(figureContainer, zIndex);

      figureContainer.x = entity.position.x * blockWidthPx;
      figureContainer.y = entity.position.y * blockHeightPx;
    }

    instantiateSprite(entity, figureId, figureContainer);
  }

  function instantiateSprite(entity, figureId, figureContainer) {
    let sprite = figureContainer.getChildByName('sprite');

    if (!sprite) {
      // Should happen only once
      // console.log('instantiateSprite:', entity);
      const texture = PIXI.loader.resources[entity.figureName].texture;
      sprite = new PIXI.Sprite(texture);
      sprite.name = 'sprite';

      if (entity.spriteOffset) {
        sprite.x += entity.spriteOffset.x;
        sprite.y += entity.spriteOffset.y;
      }

      figureContainer.addChild(sprite);
    }
  }
};
