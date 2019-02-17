// @format

'use strict';

g.world.worldRender = (walkie, auth, viewport, freshEntities, pixiFactory) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');
  const worldContainer = viewport.getChildByName('worldContainer');

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

        showWorldContainer();
      },
      false
    );
  }

  function showWorldContainer() {
    battleContainer.visible = false;
    worldContainer.visible = true;

    setViewportDimentions();
  }

  function setViewportDimentions() {
    const gameEntity = freshEntities()[freshEntities()._id];

    viewport.worldWidth = gameEntity.mapData.width * blockWidthPx;
    viewport.worldHeight = gameEntity.mapData.height * blockHeightPx;

    drawBackground();
  }

  function drawBackground() {
    const name = 'world_background';
    let background;

    if (worldContainer.getChildByName(name)) {
      background = worldContainer.getChildByName(name);
    }

    if (!worldContainer.getChildByName(name)) {
      // console.log('drawBackground', name);
      background = new PIXI.Graphics();
      background.name = name;
      const color = 0xc7c7c7;
      background.beginFill(color);
      const x = 0;
      const y = 0;
      const width = viewport.worldWidth;
      const height = viewport.worldHeight;
      background.drawRect(x, y, width, height);
      worldContainer.addChildZ(background, 1);
    }

    forEachFigure();
  }

  function forEachFigure() {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.figure && entity.position) {
        instantiateOrFindSprite(entity, id);
      }
    });

    triggerRenderDone();
  }

  function instantiateOrFindSprite(entity, id) {
    let sprite;

    if (worldContainer.getChildByName(id)) {
      sprite = worldContainer.getChildByName(id);
    }

    if (!worldContainer.getChildByName(id)) {
      // console.log('drawUnit', id);
      const texture = PIXI.loader.resources[entity.figure].texture;
      sprite = new PIXI.Sprite(texture);
      sprite.name = id;
      const zIndex = 100 + entity.position.y;
      worldContainer.addChildZ(sprite, zIndex);
    }

    updatePosition(sprite, entity);
  }

  function updatePosition(sprite, entity) {
    sprite.anchor = { x: 0, y: 1 };
    sprite.x = entity.position.x * blockWidthPx;
    sprite.y = entity.position.y * blockHeightPx + blockHeightPx;

    if (entity.spriteOffset) {
      sprite.x += entity.spriteOffset.x;
      sprite.y += entity.spriteOffset.y;
    }
  }

  function triggerRenderDone() {
    walkie.triggerEvent('renderDone_', 'render.js', {}, false);
  }
};
