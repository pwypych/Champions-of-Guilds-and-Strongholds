// @format

'use strict';

// What does this module do?
// When a unit moves in battle it centers viewport to that unit while tweening
g.autoload.unitFocusTween = (inject) => {
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;
  const viewport = inject.viewport;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entityTweenStart_',
      'unitFocusTween.js',
      (data) => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'battleState') {
          return;
        }

        const position = data.position;
        const time = data.time;
        focusPosition(position, time);
      },
      false
    );
  }

  function focusPosition(position, time) {
    const xPixel = position.x * blockWidthPx + blockWidthPx / 2;
    const yPixel = position.y * blockHeightPx + blockHeightPx / 2;

    setTimeout(() => {
      viewport.snap(xPixel, yPixel, { time: time, removeOnComplete: true });
    });
  }
};
