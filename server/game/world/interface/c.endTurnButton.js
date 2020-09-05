// @format

'use strict';

// What does this module do?
// It listens to clicks on endTurn button and sends POST
g.autoload.endTurnButton = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;
  const auth = inject.auth;

  const $button = $body.find('.js-world-interface-end-turn-button');

  (function init() {
    onClick();
    onEntitiesGet();
  })();

  function onClick() {
    $button.on('click', () => {
      sendPost();
    });
  }

  function sendPost() {
    const data = {};

    $.post('/ajax/worldEndTurn' + auth.uri, data, () => {
      console.log(
        'endTurnButton: POST -> /ajax/worldEndTurn',
        data
      );
    });
  }

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'endTurnButton.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];
        if (gameEntity.state !== 'worldState') {
          return;
        }

        checkIfCurrentPlayerEndedTurn();
      },
      false
    );
  }

  function checkIfCurrentPlayerEndedTurn() {
    let ownerEndedTurn = false;
    _.forEach(freshEntities(), (entity) => {
      if (entity.playerCurrent && entity.endTurn) {
        ownerEndedTurn = true;
      }
    });

    if (ownerEndedTurn) {
      $button.attr('disabled', 'disabled');
    } else {
      $button.removeAttr('disabled');
    }
  }
};
