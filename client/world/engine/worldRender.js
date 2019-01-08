// @format

'use strict';

g.world.worldRender = (walkie, auth, viewport, freshEntities, spriteBucket) => {
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

    removeViewportChildren();
  }

  function removeViewportChildren() {
    // to prevent memory leak
    viewport.removeChildren();

    cleanSpriteBucket();
  }

  function cleanSpriteBucket() {
    // to prevent memory leak
    Object.keys(spriteBucket).forEach((key) => {
      delete spriteBucket[key];
    });

    drawBackground();
  }

  function drawBackground() {
    const background = new PIXI.Graphics();
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
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.figure && entity.position) {
        instantiateSprites(entity, id);
      }
    });

    triggerWorldRenderDone();
  }

  function instantiateSprites(entity, id) {
    const texture = PIXI.loader.resources[entity.figure].texture;
    const sprite = new PIXI.Sprite(texture);

    sprite.anchor = { x: 0, y: 1 };

    sprite.x = entity.position.x * blockWidthPx;
    sprite.y = entity.position.y * blockHeightPx + blockHeightPx;

    if (entity.spriteOffset) {
      sprite.x += entity.spriteOffset.x;
      sprite.y += entity.spriteOffset.y;
    }

    viewport.addChild(sprite);
    spriteBucket[id] = sprite;
  }

  function triggerWorldRenderDone() {
    walkie.triggerEvent('renderDone_', 'render.js', {}, false);
  }
};
