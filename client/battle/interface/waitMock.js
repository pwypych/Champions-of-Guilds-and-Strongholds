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
    generateShootPath(activeUnitPosition, unitId);
  }

  function generateShootPath(activeUnitPosition, unitId) {
    const shootPath = [];
    for (let i = 1; i < 4; i += 1) {
      const position = {};
      position.x = activeUnitPosition.x + i;
      position.y = activeUnitPosition.y;
      shootPath.push(position);
    }

    console.log('shootPath.length:', shootPath.length);
    sendPost(shootPath, unitId);
  }

  function sendPost(shootPath, unitId) {
    const data = {};
    data.entityId = unitId;
    data.shootPath = shootPath;

    $.post('/ajax/battle/shoot/maneuverShootPost' + auth.uri, data, () => {
      console.log(
        'waitMock: POST -> /ajax/battle/shoot/maneuverShootPost',
        data
      );
    });
  }
};
