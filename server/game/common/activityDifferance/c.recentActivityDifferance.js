// @format

'use strict';

// What does this module do?
// Checks changes in every entitie.recentActivity and trigger event if change in activity was found
g.autoload.recentActivityDifferance = (inject) => {
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  let oldEntities;

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGetEvent_',
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
      if (oldEntities[id]) { // sometimes entities get deleted, or hidden by server, must exist to run recentActivity
        if (!_.isEqual(entity.recentActivity, oldEntities[id].recentActivity)) {
          const data = {
            entityId: id,
            entity: entity,
            entityOld: oldEntities[id]
          };

          walkie.triggerEvent(
            'recentActivityDifferanceFoundEvent_',
            'recentActivityDifferance.js',
            data,
            true
          );
        }
      }
    }
  }
};
