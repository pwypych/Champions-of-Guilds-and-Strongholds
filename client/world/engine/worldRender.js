// @format

'use strict';

g.world.worldRender = (walkie, auth, viewport, freshEntities, pixiFactory) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'worldRender.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'worldState') {
          return;
        }

        setViewportDimentions();
      },
      false
    );
  }

  function setViewportDimentions() {
    const gameEntity = freshEntities()[freshEntities()._id];

    viewport.worldWidth = gameEntity.mapData.width * blockWidthPx;
    viewport.worldHeight = gameEntity.mapData.height * blockHeightPx;

    preventMemoryLeak();
  }

  function preventMemoryLeak() {
    viewport.removeChildren();
    pixiFactory.destroyAll();

    drawBackground();
  }

  function drawBackground() {
    const background = pixiFactory.newGraphics();
    const color = 0xc7c7c7;
    background.beginFill(color);
    const x = 0;
    const y = 0;
    const width = viewport.worldWidth;
    const height = viewport.worldHeight;
    background.drawRect(x, y, width, height);

    viewport.addChild(background);

    forEachFigure();
  }

  function forEachFigure() {
    _.forEach(freshEntities(), (entity) => {
      if (entity.figure && entity.position) {
        instantiateSprites(entity);
      }
    });

    triggerRenderDone();
  }

  function instantiateSprites(entity) {
    const texture = PIXI.loader.resources[entity.figure].texture;
    const sprite = pixiFactory.newSprite(texture);

    sprite.anchor = { x: 0, y: 1 };

    sprite.x = entity.position.x * blockWidthPx;
    sprite.y = entity.position.y * blockHeightPx + blockHeightPx;

    if (entity.spriteOffset) {
      sprite.x += entity.spriteOffset.x;
      sprite.y += entity.spriteOffset.y;
    }

    viewport.addChild(sprite);
  }

  function triggerRenderDone() {
    walkie.triggerEvent('renderDone_', 'render.js', {}, false);
  }
};
