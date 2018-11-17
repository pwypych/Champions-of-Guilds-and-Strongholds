// @format

'use strict';

g.launch.launch = (auth) => {
  const $launch = $('#js-launch');
  const $inputName = $launch.find('.js-input-name');

  let writingTimeout;

  (function init() {
    $launch.show();
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

    $.post('/ajax/launchState/playerNamePost' + auth.uri, data);
  }
};
