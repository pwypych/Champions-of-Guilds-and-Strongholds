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
    console.log('doSomethingOnFreshEntities', entities);

    sendPost();
  }

  function sendPost() {
    const data = {};
    console.log('data', data);

    $.post('/ajax/battle/shoot/maneuverShootPost' + auth.uri, data, () => {
      console.log(
        'waitMock: POST -> /ajax/battle/shoot/maneuverShootPost',
        data
      );
    });
  }
};
