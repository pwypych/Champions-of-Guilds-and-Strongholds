// @format

'use strict';

g.battle.battleRender = (
  walkie,
  auth,
  viewport,
  freshEntities,
  spriteBucket
) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'battleRender.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'battleState') {
          return;
        }

        setViewportDimentions();
      },
      false
    );
  }

  // battle map is 15 x 20
  function setViewportDimentions() {
    viewport.worldWidth = 20 * blockWidthPx;
    viewport.worldHeight = 15 * blockHeightPx;

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
      if (entity.unitName && entity.position) {
        instantiateSprites(entity, id);
      }
    });

    triggerRenderDone();
  }

  function instantiateSprites(entity, id) {
    const texture = PIXI.loader.resources[entity.unitName].texture;
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

  function triggerRenderDone() {
    walkie.triggerEvent('renderDone_', 'render.js', {}, false);
  }
};
