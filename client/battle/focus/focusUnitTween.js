// @format

'use strict';

g.battle.focusUnitTween = (walkie, viewport, freshEntities) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entityTweenStart_',
      'focusUnitTween.js',
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

    console.log('focusUnitTween.js: focusPosition()', position, xPixel, yPixel);
    setTimeout(() => {
      viewport.snap(xPixel, yPixel, { time: time, removeOnComplete: true });
    });
  }
};
