// @format

'use strict';

// What does this module do?
// Prepares viewport when state is changed to worldState
g.autoload.worldToggle = (inject) => {
  const viewport = inject.viewport;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');
  const worldContainer = viewport.getChildByName('worldContainer');

  (function init() {
    onStateChange();
  })();

  function onStateChange() {
    walkie.onEvent(
      'stateChangeEvent_',
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
    walkie.triggerEvent('viewportWorldReady_', 'worldToggle.js', {}, true);
  }
};
