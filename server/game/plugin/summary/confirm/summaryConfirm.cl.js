// @format

'use strict';

g.summary.summaryConfirm = ($body, auth) => {
  const $button = $body.find('.js-summary .js-summary-button');

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

    $.post('/ajax/summaryConfirm' + auth.uri, data, () => {
      console.log('summaryConfirm: POST -> /ajax/summaryConfirm', data);
    });
  }
};
