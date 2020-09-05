// @format

'use strict';

// What does this module do?
// It listens to click_ events, checks if click happened on enemy that is not one block away and sends shoot POST
g.autoload.shootClick = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;
  const freshEntities = inject.freshEntities;

  (function init() {
    onClick();
  })();

  function onClick() {
    walkie.onEvent(
      'click_',
      'shootClick.js',
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

    if (isNear) {
      console.log('shootClick:isEnemyNear: Yes, enemy too near to shoot!');
      return;
    }

    maneuverShootPost(clickPosition, unitId);
  }

  function maneuverShootPost(clickPosition, unitId) {
    const data = { shootOnPosition: clickPosition, entityId: unitId };
    console.log('maneuverShootPost: data:', data);
    $.post('/ajax/maneuverShoot' + auth.uri, data, () => {});
  }
};
