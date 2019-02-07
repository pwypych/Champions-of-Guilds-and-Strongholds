// @format

'use strict';

g.battle.finishedConfirm = ($body, auth) => {
  const $button = $body.find(
    '.js-battle-finished-modal .js-battle-finished-button'
  );

  (function init() {
    buttonOnClick();
  })();

  function buttonOnClick() {
    $button.on('click', () => {
      console.log('finishedConfirm:buttonOnClick()');
      sendPost();
    });
  }

  function sendPost() {
    const data = {};

    $.post('/ajax/battle/finishedBattleConfirmPost' + auth.uri, data, () => {
      console.log(
        'finishedConfirm: POST -> /ajax/battle/finishedBattleConfirmPost',
        data
      );
    });
  }
};
