// @format

'use strict';

g.autoload.figuresDraw = (inject) => {
  const viewport = inject.viewport;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const worldContainer = viewport.getChildByName('worldContainer');

  (function init() {
    onViewPortWorldReady();
  })();

  function onViewPortWorldReady() {
    walkie.onEvent(
      'viewportWorldReady_',
      'figuresDraw.js',
      () => {
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

    triggerFiguresDrawn();
  }

  function instantiateFigureContainer(entity, figureId) {
    let figureContainer = worldContainer.getChildByName(figureId);

    if (!figureContainer) {
      // Should happen only once
      // console.log('figuresDraw: figure container', figureId);
      figureContainer = new PIXI.ContainerZ();
      figureContainer.name = figureId;
      const zOrder = 100 + entity.position.y;
      worldContainer.addChildZ(figureContainer, zOrder);

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

  function triggerFiguresDrawn() {
    walkie.triggerEvent(
      'figuresDrawn_',
      'figuresDraw.js',
      {},
      true
    );
  }
};
