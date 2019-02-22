// @format

'use strict';

g.world.figurePositionChange = (walkie, freshEntities) => {
  let oldEntities;

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'figurePositionChange.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];
        if (gameEntity.state !== 'worldState') {
          return;
        }

        ensureOldEntitiesDefined();
      },
      false
    );
  }

  function ensureOldEntitiesDefined() {
    if (!oldEntities) {
      oldEntities = freshEntities();
    }

    checkPositionChange();
  }

  function checkPositionChange() {
    const entities = freshEntities();

    _.forEach(entities, (entity, id) => {
      if (entity.figureName && entity.position) {
        if (!_.isEqual(entity.position, oldEntities[id].position)) {
          const data = {
            figureId: id,
            fromPosition: oldEntities[id].position,
            toPosition: entity.position
          };
          triggerFigurePositionChanged(data);
        }
      }
    });

    oldEntities = freshEntities();
  }

  function triggerFigurePositionChanged(data) {
    walkie.triggerEvent(
      'figurePositionChanged_',
      'figurePositionChange.js',
      data,
      true
    );
  }
};
