// @format

'use strict';

g.autoload.recentActivityDifferance = (inject) => {
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  let oldEntities;

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'recentActivityDifferance.js',
      () => {
        ensureOldEntitiesDefined();
      },
      false
    );
  }

  function ensureOldEntitiesDefined() {
    if (!oldEntities) {
      oldEntities = freshEntities();
      triggerEntitiesGetFirst();
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
    if (!oldEntities[id]) {
      oldEntities = freshEntities();
      triggerEntitiesGetFirst();
    }

    if (entity.recentActivity) {
      if (!_.isEqual(entity.recentActivity, oldEntities[id].recentActivity)) {
        const data = {
          entityId: id,
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

  function triggerEntitiesGetFirst() {
    walkie.triggerEvent(
      'entitiesGetFirst_',
      'recentActivityDifferance.js',
      {},
      true
    );
  }
};
