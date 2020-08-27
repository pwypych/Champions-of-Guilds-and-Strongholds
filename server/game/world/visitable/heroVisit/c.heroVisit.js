// @format

'use strict';

g.world.heroVisit = (walkie, freshEntities) => {
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
        entity.visitableName
      ) {
        triggerHeroCurrentVisited(id, entity.visitableName);
      }
    });
  }

  function triggerHeroCurrentVisited(entityId, visitableName) {
    walkie.triggerEvent(
      'heroCurrentVisited_',
      'heroVisit.js',
      {
        entityId: entityId,
        visitableName: visitableName
      },
      true
    );
  }
};
