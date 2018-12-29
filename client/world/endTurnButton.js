// @format

'use strict';

// What does this module do?
// It listens to clicks on endTurn button and sends POST
g.world.endTurnButton = ($body, auth) => {
  const $button = $body.find('#js-end-turn-button');

  (function init() {
    onClick();
  })();

  function onClick() {
    $button.on('click', () => {
      sendPost();
    });
  }

  function sendPost() {
    const data = {};

    $.post('/ajax/worldState/endTurn/endTurnPost' + auth.uri, data, () => {
      console.log(
        'endTurnButton: POST -> /ajax/worldState/endTurn/endTurnPost',
        data
      );
    });
  }
};
