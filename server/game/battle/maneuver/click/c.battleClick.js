// @format

'use strict';

// What does this module do?
// It listens to viewport clicked events, validates it and sends clickEvent_ through walkie
g.autoload.battleClick = (inject) => {
  const viewport = inject.viewport;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  (function init() {
    addListener();
  })();

  function addListener() {
    viewport.on('clicked', (event) => {
      const gameEntity = freshEntities()[freshEntities()._id];
      if (gameEntity.state !== 'battleState') {
        return;
      }

      checkViewportBounds(event);
    });
  }

  function checkViewportBounds(event) {
    if (event.world.x > viewport.worldWidth) {
      return;
    }

    if (event.world.x < 0) {
      return;
    }

    if (event.world.y > viewport.worldHeight) {
      return;
    }

    if (event.world.y < 0) {
      return;
    }

    calculatePosition(event);
  }

  function calculatePosition(event) {
    const position = {};
    position.x = Math.floor(event.world.x / blockWidthPx);
    position.y = Math.floor(event.world.y / blockHeightPx);

    triggerClick(position);
  }

  function triggerClick(position) {
    walkie.triggerEvent(
      'clickEvent_',
      'battleClick.js',
      {
        position: position
      },
      false
    );
  }
};
