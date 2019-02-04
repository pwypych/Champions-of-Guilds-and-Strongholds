// @format

'use strict';

g.battle.unitRecentManeuverChange = (walkie, freshEntities) => {
  let oldEntities;

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'unitRecentManeuverChange.js',
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

    forEachEntity();
  }

  function forEachEntity() {
    const entities = freshEntities();

    _.forEach(entities, (entity, id) => {
      checkRecentManeuverChange(entity, id);
    });

    oldEntities = freshEntities();
  }

  function checkRecentManeuverChange(entity, id) {
    if (entity.recentManeuver) {
      if (!_.isEqual(entity.recentManeuver, oldEntities[id].recentManeuver)) {
        const data = {
          unitId: id,
          entity: entity,
          entityOld: oldEntities[id]
        };

        walkie.triggerEvent(
          'recentManeuverChanged_',
          'unitRecentManeuverChange.js',
          data,
          true
        );
      }
    }
  }
};
