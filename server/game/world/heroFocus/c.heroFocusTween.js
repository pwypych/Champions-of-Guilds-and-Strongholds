// @format

'use strict';

// What does this module do?
// When player hero moves in worldState it centers viewport to that unit while tweening
g.autoload.heroFocusTween = (inject) => {
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;
  const viewport = inject.viewport;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  (function init() {
    onEntityTweenStart();
  })();

  function onEntityTweenStart() {
    walkie.onEvent(
      'entityTweenStart_',
      'heroFocusTween.js',
      (data) => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'worldState') {
          return;
        }

        const entityId = data.entityId;
        const position = data.position;
        const time = data.time;
        findPlayerId(entityId, position, time);
      },
      false
    );
  }

  function findPlayerId(entityId, position, time) {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.playerCurrent) {
        const playerId = id;

        if (freshEntities()[entityId].owner !== playerId) {
          return;
        }

        focusPosition(position, time);
      }
    });
  }

  function focusPosition(position, time) {
    const xPixel = position.x * blockWidthPx + blockWidthPx / 2;
    const yPixel = position.y * blockHeightPx + blockHeightPx / 2;

    setTimeout(() => {
      viewport.snap(xPixel, yPixel, { time: time, removeOnComplete: true });
    });
  }
};
