// @format

'use strict';

// What does this module do?
// It listens to confirm button click and sends confirmation info to server, so new battle or world can be loaded after summary
g.autoload.summaryConfirm = (inject) => {
  const $body = inject.$body;
  const auth = inject.auth;

  const $button = $body.find('[data-summary] .js-summary-button');

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
