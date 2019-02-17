// @format

'use strict';

g.battle.recentManeuverDifferance = (walkie, freshEntities) => {
  let oldEntities;

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'recentManeuverDifferance.js',
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
      checkRecentManeuverDifferance(entity, id);
    });

    oldEntities = freshEntities();

    walkie.triggerEvent(
      'recentManeuverDifferanceDone_',
      'recentManeuverDifferance.js',
      {},
      false
    );
  }

  function checkRecentManeuverDifferance(entity, id) {
    if (entity.recentManeuver) {
      if (!_.isEqual(entity.recentManeuver, oldEntities[id].recentManeuver)) {
        const data = {
          unitId: id,
          entity: entity,
          entityOld: oldEntities[id]
        };

        walkie.triggerEvent(
          'recentManeuverDifferanceFound_',
          'recentManeuverDifferance.js',
          data,
          true
        );
      }
    }
  }
};
