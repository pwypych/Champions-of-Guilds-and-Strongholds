// @format

'use strict';

// What does this module do?
// It listens to click_ events, checks if click happened on enemy one block away and sends melee POST
g.battle.enemyClick = (walkie, auth, viewport, freshEntities) => {
  (function init() {
    onClick();
  })();

  function onClick() {
    walkie.onEvent(
      'click_',
      'enemyClick.js',
      (data) => {
        const clickPosition = data.position;
        findPlayerId(clickPosition);
      },
      true
    );
  }

  function findPlayerId(clickPosition) {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.playerCurrent) {
        const playerId = id;
        findActiveUnit(playerId, clickPosition);
      }
    });
  }

  function findActiveUnit(playerId, clickPosition) {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.unitStats && entity.active && entity.owner === playerId) {
        const unitId = id;
        isEnemyOnClickPosition(unitId, playerId, clickPosition);
      }
    });
  }

  function isEnemyOnClickPosition(unitId, playerId, clickPosition) {
    let enemy;

    _.forEach(freshEntities(), (entity) => {
      if (entity.unitStats && entity.owner !== playerId) {
        if (
          entity.position.x === clickPosition.x &&
          entity.position.y === clickPosition.y
        ) {
          enemy = entity;
        }
      }
    });

    if (!enemy) {
      return;
    }

    maneuverMeleePost(clickPosition, unitId);
  }

  function maneuverMeleePost(clickPosition, unitId) {
    const data = { meleeOnPosition: clickPosition, entityId: unitId };
    console.log('maneuverMeleePost: data:', data);
    $.post('/ajax/battle/melee/maneuverMeleePost' + auth.uri, data, () => {});
  }
};
