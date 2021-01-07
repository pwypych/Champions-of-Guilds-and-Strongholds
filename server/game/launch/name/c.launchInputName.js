// @format

'use strict';

// What does this module do?
// It listens to user name input, and sends updates to server while player is writing the name
g.autoload.launchInputName = (inject) => {
  const $body = inject.$body;
  const auth = inject.auth;

  const $inputName = $body.find('.js-launch [data-input-name]');

  let writingTimeout;

  (function init() {
    inputNameOn();
  })();

  function inputNameOn() {
    $inputName.on('keypress paste input', () => {
      clearTimeout(writingTimeout);
      writingTimeout = setTimeout(() => {
        sendPost();
      }, 500);
    });
  }

  function sendPost() {
    const data = {
      playerName: $inputName.val()
    };

    $.post('/ajax/launchNamePost' + auth.uri, data, () => {
      console.log('launchInputName: POST -> /ajax/launchNamePost', data);
    });
  }
};
