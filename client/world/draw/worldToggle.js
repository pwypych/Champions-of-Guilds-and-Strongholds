// @format

'use strict';

g.world.worldToggle = (walkie, viewport, freshEntities) => {
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
      'worldToggle.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'worldState') {
          return;
        }

        worldToggle(gameEntity);
      },
      false
    );
  }

  function worldToggle(gameEntity) {
    battleContainer.visible = false;
    worldContainer.visible = true;

    setViewportDimentions(gameEntity);
  }

  function setViewportDimentions(gameEntity) {
    viewport.worldWidth = gameEntity.mapData.width * blockWidthPx;
    viewport.worldHeight = gameEntity.mapData.height * blockHeightPx;
  }
};
