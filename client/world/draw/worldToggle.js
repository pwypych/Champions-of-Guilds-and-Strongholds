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
      'entitiesGetFirst_',
      'worldToggle.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'worldState') {
          return;
        }

        worldShow(gameEntity);
      },
      false
    );
  }

  function worldShow(gameEntity) {
    battleContainer.visible = false;
    worldContainer.visible = true;

    setViewportDimentions(gameEntity);
  }

  function setViewportDimentions(gameEntity) {
    viewport.worldWidth = gameEntity.mapData.width * blockWidthPx;
    viewport.worldHeight = gameEntity.mapData.height * blockHeightPx;

    triggerViewportWorldReady();
  }

  function triggerViewportWorldReady() {
    walkie.triggerEvent('viewportReady_', 'worldToggle.js', {}, true);
  }
};
