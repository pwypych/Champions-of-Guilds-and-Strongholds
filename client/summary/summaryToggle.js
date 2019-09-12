// @format

'use strict';

g.summary.summaryToggle = ($body, walkie, freshEntities) => {
  const $summary = $body.find('.js-summary');
  const $button = $summary.find('.js-summary-button');
  const $text = $summary.find('.js-summary-text');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'summaryToggle.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'summaryState') {
          $summary.hide();
          return;
        }

        $summary.show();
        findPlayerId();
      },
      false
    );
  }

  function findPlayerId() {
    let playerId;
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.playerCurrent) {
        playerId = id;
      }
    });

    checkIfWinner(playerId);
  }

  function checkIfWinner(playerId) {
    let isPlayerWinner = false;
    _.forEach(freshEntities(), (entity) => {
      if (entity.unitStats && entity.owner === playerId) {
        isPlayerWinner = true;
      }
    });

    if (isPlayerWinner) {
      showWinnerText();
    } else {
      showLoserText();
    }
  }

  function showWinnerText() {
    $button.show();
    $text.html('You have won! <br/><br/>');
  }

  function showLoserText() {}
  $button.hide();
  $text.html(
    'You have lost this battle... <br/><br/> Waiting for winner to continue...'
  );
};
