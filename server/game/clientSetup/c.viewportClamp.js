// @format

'use strict';

// What does this module do?
// Sets up viewport clamp, so viewport never leaves too much outside world boundaries
g.autoload.viewportClamp = (inject) => {
  const walkie = inject.walkie;
  const viewport = inject.viewport;

  (function init() {
    onViewportWorldReady();
    onViewportBattleReady();
  })();

  function onViewportWorldReady() {
    walkie.onEvent(
      'viewportWorldReady_',
      'worldClamp.js',
      () => {
        clampViewport();
      },
      false
    );
  }

  function onViewportBattleReady() {
    walkie.onEvent(
      'viewportBattleReady_',
      'worldClamp.js',
      () => {
        clampViewport();
      },
      false
    );
  }

  function clampViewport() {
    viewport.clamp({
      left: -64,
      right: viewport.worldWidth + 64,
      top: -64,
      bottom: viewport.worldHeight + 64
    });
  }
};
