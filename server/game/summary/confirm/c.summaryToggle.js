// @format

'use strict';

// What does this module do?
// Shows battle summary when state is changed to summaryState and shows summary info
g.autoload.summaryToggle = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  const $summary = $body.find('[data-summary]');
  const $button = $summary.find('.js-summary-button');
  const $text = $summary.find('.js-summary-text');

  (function init() {
    onStateChange();
  })();

  function onStateChange() {
    walkie.onEvent(
      'stateChange_',
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
