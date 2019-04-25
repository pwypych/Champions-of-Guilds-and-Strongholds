// @format

'use strict';

g.launch.launchInputName = ($body, auth) => {
  const $inputName = $body.find('.js-launch .js-input-name');

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

    $.post('/ajax/launch/name/playerNamePost' + auth.uri, data, () => {
      console.log('launchInputName: POST -> /ajax/launch/playerNamePost', data);
    });
  }
};
