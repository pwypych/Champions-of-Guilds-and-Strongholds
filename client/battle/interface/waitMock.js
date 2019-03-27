// @format

'use strict';

// What does this module do?
// Temporary module. It uses wait button in battle for various testing purposes
g.battle.waitMock = ($body, auth, freshEntities) => {
  const $maneuverButtons = $body.find('.js-battle-interface-maneuver-buttons');
  const $button = $maneuverButtons.find('.js-wait-button');

  (function init() {
    onClick();
  })();

  function onClick() {
    $button.on('click', () => {
      doSomethingOnFreshEntities();
    });
  }

  function doSomethingOnFreshEntities() {
    const entities = freshEntities();
    const activeUnitPosition = {};
    let unitId;

    console.log('doSomethingOnFreshEntities', entities);
    _.forEach(entities, (entity, id) => {
      if (entity.unitStats && entity.active === true) {
        console.log('id:', id);
        unitId = id;
        activeUnitPosition.x = entity.position.x;
        activeUnitPosition.y = entity.position.y;
      }
    });

    console.log('activeUnitPosition:', activeUnitPosition);
    sendPost(unitId);
  }

  function sendPost(unitId) {
    const data = {};
    data.entityId = unitId;
    data.wait = true;

    $.post('/ajax/battle/wait/maneuverwait' + auth.uri, data, () => {
      console.log('waitMock: POST -> /ajax/battle/wait/maneuverwait', data);
    });
  }
};
