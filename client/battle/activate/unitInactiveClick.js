// @format

'use strict';

// What does this module do?
// It listens to click_ events, for unit owned by player, that is inactive with maneuvers remaining, and activates it
g.battle.unitInactiveClick = (walkie, auth, freshEntities) => {
  (function init() {
    onClick();
  })();

  function onClick() {
    walkie.onEvent(
      'click_',
      'unitInactiveClick.js',
      (data) => {
        const clickPosition = data.position;
        findPlayerId(clickPosition);
      },
      false
    );
  }

  function findPlayerId(clickPosition) {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.playerCurrent) {
        const playerId = id;
        findUnit(clickPosition, playerId);
      }
    });
  }

  function findUnit(clickPosition, playerId) {
    const entities = freshEntities();

    console.log('clickPosition', clickPosition);
    console.log('playerId', playerId);

    let unit;
    let unitId;
    _.forEach(entities, (entity, id) => {
      if (
        entity.unitName &&
        entity.owner === playerId &&
        entity.position.x === clickPosition.x &&
        entity.position.y === clickPosition.y &&
        !entity.active &&
        !entity.dead &&
        entity.unitStats.current.maneuverPoints > 0
      ) {
        unit = entity;
        unitId = id;
      }
    });

    if (!unit) {
      console.log('unitInactiveClick: Unit cannot be activated');
      return;
    }

    console.log('unitInactiveClick: Unit should be activated: unitId', unitId);

    sendRequest(unitId);
  }

  function sendRequest(entityId) {
    const data = { entityId: entityId };
    $.post(
      '/ajax/battleActivateUnit' + auth.uri,
      data,
      (response) => {
        console.log('unitInactiveClick.js: POST pathPost', response);
      }
    );
  }
};
