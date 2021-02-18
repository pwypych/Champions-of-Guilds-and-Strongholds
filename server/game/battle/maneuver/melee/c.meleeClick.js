// @format

'use strict';

// What does this module do?
// It listens to clickEvent_, checks if click happened on enemy one block away and sends melee POST
g.autoload.meleeClick = (inject) => {
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;
  const auth = inject.auth;

  (function init() {
    onClick();
  })();

  function onClick() {
    walkie.onEvent(
      'clickEvent_',
      'meleeClick.js',
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
        const unit = entity;
        isEnemyOnClickPosition(unit, unitId, playerId, clickPosition);
      }
    });
  }

  function isEnemyOnClickPosition(unit, unitId, playerId, clickPosition) {
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

    isEnemyNear(unit, enemy, clickPosition, unitId);
  }

  function isEnemyNear(unit, enemy, clickPosition, unitId) {
    let isNear = false;
    [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }].forEach(
      (offset) => {
        if (
          unit.position.x === enemy.position.x + offset.x &&
          unit.position.y === enemy.position.y + offset.y
        ) {
          // console.log('findEnemies: enemy.position:', enemy.position);
          isNear = true;
        }
      }
    );

    if (!isNear) {
      console.log('meleeClick:isEnemyNear: Nope!');
      return;
    }

    maneuverMeleePost(clickPosition, unitId);
  }

  function maneuverMeleePost(clickPosition, unitId) {
    const data = { meleeOnPosition: clickPosition, entityId: unitId };
    console.log('maneuverMeleePost: data:', data);
    $.post('/ajax/maneuverMelee' + auth.uri, data, () => {});
  }
};
