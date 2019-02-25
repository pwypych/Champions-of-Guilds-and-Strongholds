// @format

'use strict';

g.world.drawBackground = (walkie, viewport, freshEntities) => {
  const worldContainer = viewport.getChildByName('worldContainer');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'drawBackground.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'worldState') {
          return;
        }

        drawBackground();
      },
      false
    );
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
      const zOrder = 1;
      worldContainer.addChildZ(background, zOrder);
    }
  }
};
