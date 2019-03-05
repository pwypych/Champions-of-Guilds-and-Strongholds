// @format

'use strict';

g.common.viewportClamp = (walkie, viewport) => {
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
      left: -32,
      right: viewport.worldWidth + 32,
      top: -32,
      bottom: viewport.worldHeight + 32
    });
  }
};
