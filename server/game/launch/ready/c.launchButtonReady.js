// @format

'use strict';

g.autoload.launchButtonReady = (inject) => {
  const $body = inject.$body;
  const auth = inject.auth;

  const $button = $body.find('.js-launch .js-button-ready');

  (function init() {
    buttonOnClick();
  })();

  function buttonOnClick() {
    $button.on('click', () => {
      sendPost();
    });
  }

  function sendPost() {
    const data = {};

    $.post('/ajax/launchReadyPost' + auth.uri, data, () => {
      console.log(
        'launchButtonReady: POST -> /ajax/launchReadyPost',
        data
      );
    });
  }
};
