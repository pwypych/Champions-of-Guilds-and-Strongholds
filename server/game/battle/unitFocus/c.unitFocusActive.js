// @format

'use strict';

// What does this module do?
// When a new unit becomes active it centers viewport to that position
g.autoload.unitFocusActive = (inject) => {
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;
  const viewport = inject.viewport;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  let oldActiveUnitId;

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'unitFocusActive.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'battleState') {
          return;
        }

        findActiveUnit();
      },
      false
    );
  }

  function findActiveUnit() {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.unitStats && entity.active) {
        const position = entity.position;
        const unitId = id;
        if (unitId !== oldActiveUnitId) {
          focusUnitPosition(position, unitId);
        }
      }
    });
  }

  function focusUnitPosition(position, unitId) {
    oldActiveUnitId = unitId;

    const xPixel = position.x * blockWidthPx + blockWidthPx / 2;
    const yPixel = position.y * blockHeightPx + blockHeightPx / 2;

    setTimeout(() => {
      viewport.snap(xPixel, yPixel, { time: 500, removeOnComplete: true });
    });
  }
};
