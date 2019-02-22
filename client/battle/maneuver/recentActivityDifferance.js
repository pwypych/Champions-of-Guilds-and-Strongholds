// @format

'use strict';

g.battle.recentActivityDifferance = (walkie, freshEntities) => {
  let oldEntities;

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'recentActivityDifferance.js',
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
      checkRecentActivityDifferance(entity, id);
    });

    oldEntities = freshEntities();

    walkie.triggerEvent(
      'recentActivityDifferanceDone_',
      'recentActivityDifferance.js',
      {},
      false
    );
  }

  function checkRecentActivityDifferance(entity, id) {
    if (entity.recentActivity) {
      if (!_.isEqual(entity.recentActivity, oldEntities[id].recentActivity)) {
        const data = {
          unitId: id,
          entity: entity,
          entityOld: oldEntities[id]
        };

        walkie.triggerEvent(
          'recentActivityDifferanceFound_',
          'recentActivityDifferance.js',
          data,
          true
        );
      }
    }
  }
};
