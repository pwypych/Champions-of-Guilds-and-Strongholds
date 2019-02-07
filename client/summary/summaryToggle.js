// @format

'use strict';

g.battle.summaryToggle = ($body, walkie, auth, freshEntities) => {
  const $summaryModal = $body.find('.js-battle-summary-modal');
  const $button = $summaryModal.find('.js-battle-summary-button');
  const $text = $summaryModal.find('.js-battle-summary-text');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'summaryToggle.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'battleState') {
          return;
        }

        findBattleEntity();
      },
      false
    );
  }

  function findBattleEntity() {
    let battleEntity;
    _.forEach(freshEntities(), (entity) => {
      if (entity.battleStatus === 'finished') {
        battleEntity = entity;
      }
    });

    if (!battleEntity) {
      $summaryModal.hide();
      return;
    }

    $summaryModal.show();

    findPlayerId();
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
    $text.html('You have won!');
  }

  function showLoserText() {}
  $button.hide();
  $text.html('You have lost this battle...');
};
