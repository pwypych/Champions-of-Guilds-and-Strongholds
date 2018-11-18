// @format

'use strict';

g.launch.launch = (auth, walkie) => {
  const $launch = $('#js-launch');
  const $inputName = $launch.find('.js-input-name');

  let writingTimeout;

  (function init() {
    $launch.show();

    walkie.onEvent('playerNamePost_', 'launch', (data) => {
      console.log('hello', data);
    });

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

    walkie.triggerEvent('playerNamePost_', 'launch', data, 'dupa', 'cos', true);

    $.post('/ajax/launchState/playerNamePost' + auth.uri, data);
  }
};
