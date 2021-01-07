// @format

'use strict';

// What does this module do?
// It listens to user ready button click, and sends information that player is ready to server after click
g.autoload.launchButtonReady = (inject) => {
  const $body = inject.$body;
  const auth = inject.auth;

  const $button = $body.find('[data-launch] [data-button-ready]');

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
      console.log('launchButtonReady: POST -> /ajax/launchReadyPost', data);
    });
  }
};
