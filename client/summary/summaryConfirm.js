// @format

'use strict';

g.battle.summaryConfirm = ($body, auth) => {
  const $button = $body.find(
    '.js-battle-summary-modal .js-battle-summary-button'
  );

  (function init() {
    buttonOnClick();
  })();

  function buttonOnClick() {
    $button.on('click', () => {
      console.log('summaryConfirm:buttonOnClick()');
      sendPost();
    });
  }

  function sendPost() {
    const data = {};

    $.post('/ajax/summary/summaryConfirmPost' + auth.uri, data, () => {
      console.log(
        'summaryConfirm: POST -> /ajax/summary/summaryConfirmPost',
        data
      );
    });
  }
};
