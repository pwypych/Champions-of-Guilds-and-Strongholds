// @format

'use strict';

g.battle.finishedModal = ($body, walkie, auth, freshEntities) => {
  const $finishedModal = $body.find('.js-battle-finished-modal');
  const $button = $finishedModal.find('.js-battle-finished-button');
  const $text = $finishedModal.find('.js-battle-finished-text');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'finishedModal.js',
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
      $finishedModal.hide();
      return;
    }

    $finishedModal.show();

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
