// @format

'use strict';

g.battle.unitPositionChange = (walkie, freshEntities) => {
  let oldEntities;

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'unitPositionChange.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];
        if (gameEntity.state !== 'battleState') {
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
      if (entity.unitName && entity.position) {
        if (!_.isEqual(entity.position, oldEntities[id].position)) {
          const data = {
            unitId: id,
            fromPosition: oldEntities[id].position,
            toPosition: entity.position
          };
          triggerUnitPositionChanged(data);
        }
      }
    });

    oldEntities = freshEntities();
  }

  function triggerUnitPositionChanged(data) {
    walkie.triggerEvent(
      'unitPositionChanged_',
      'unitPositionChange.js',
      data,
      true
    );
  }
};
