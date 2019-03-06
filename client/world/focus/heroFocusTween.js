// @format

'use strict';

g.world.heroFocusTween = (walkie, viewport, freshEntities) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
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

    console.log('heroFocusTween.js: focusPosition()', position, xPixel, yPixel);
    setTimeout(() => {
      viewport.snap(xPixel, yPixel, { time: time, removeOnComplete: true });
    });
  }
};
