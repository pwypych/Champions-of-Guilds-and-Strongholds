// @format

'use strict';

g.world.entityChanges = (walkie, freshEntities) => {
  let oldEntities;

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'worldToggle.js',
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
      if (entity.figure && entity.position) {
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
  }

  function triggerFigurePositionChanged(data) {
    walkie.triggerEvent(
      'figurePositionChanged_',
      'entityChanges.js',
      data,
      true
    );
  }
};
