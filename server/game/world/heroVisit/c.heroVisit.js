// @format

'use strict';

// What does this module do?
// It checks if hero has just landed on visitable figure, and triggers a visit action, so that visitable can react
g.autoload.heroVisit = (inject) => {
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  (function init() {
    onEntityTweenEnd();
  })();

  function onEntityTweenEnd() {
    walkie.onEvent(
      'entityTweenEnd_',
      'heroVisit.js',
      (data) => {
        const entityId = data.entityId;
        const position = data.position;

        findPlayerId(entityId, position);
      },
      false
    );
  }

  function findPlayerId(entityId, position) {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.playerCurrent) {
        const playerId = id;

        isPlayerHero(entityId, position, playerId);
      }
    });
  }

  function isPlayerHero(entityId, position, playerId) {
    if (
      freshEntities()[entityId].owner !== playerId ||
      !freshEntities()[entityId].heroStats
    ) {
      return;
    }

    isPositionVisitable(position);
  }

  function isPositionVisitable(position) {
    _.forEach(freshEntities(), (entity, id) => {
      if (
        entity.position &&
        entity.position.x === position.x &&
        entity.position.y === position.y &&
        entity.visitableType
      ) {
        triggerHeroCurrentVisited(id, entity.visitableType);
      }
    });
  }

  function triggerHeroCurrentVisited(entityId, visitableType) {
    walkie.triggerEvent(
      'heroCurrentVisited_',
      'heroVisit.js',
      {
        entityId: entityId,
        visitableType: visitableType
      },
      true
    );
  }
};
