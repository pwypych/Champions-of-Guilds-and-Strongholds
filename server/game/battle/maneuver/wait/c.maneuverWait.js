// @format

'use strict';

// What does this module do?
// Listens for clicks on wait button, and posts that maneuver
g.autoload.maneuverWait = (inject) => {
  const $body = inject.$body;
  const freshEntities = inject.freshEntities;
  const auth = inject.auth;

  const $maneuverButtons = $body.find('.js-battle-interface-maneuver-buttons');
  const $button = $maneuverButtons.find('.js-wait-button');

  (function init() {
    onClick();
  })();

  function onClick() {
    $button.on('click', () => {
      findActiveUnit();
    });
  }

  function findActiveUnit() {
    const entities = freshEntities();
    let unitId;

    console.log('findActiveUnit', entities);
    _.forEach(entities, (entity, id) => {
      if (entity.unitStats && entity.active === true) {
        unitId = id;
      }
    });

    sendPost(unitId);
  }

  function sendPost(unitId) {
    const data = {};
    data.entityId = unitId;

    $.post('/ajax/maneuverWait' + auth.uri, data, () => {
      console.log('maneuverWait: POST -> /ajax/maneuverWait', data);
    });
  }
};
