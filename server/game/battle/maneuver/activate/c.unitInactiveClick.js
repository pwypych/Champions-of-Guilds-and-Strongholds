// @format

'use strict';

// What does this module do?
// Listens to clickEvent_ on a unit. If unit is inactive, owned by player, with maneuvers remaining it activates it.
g.autoload.unitInactiveClick = (inject) => {
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;
  const auth = inject.auth;

  (function init() {
    onClick();
  })();

  function onClick() {
    walkie.onEvent(
      'clickEvent_',
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
    $.post('/ajax/battleActivateUnit' + auth.uri, data, (response) => {
      console.log('unitInactiveClick.js: POST pathPost', response);
    });
  }
};
