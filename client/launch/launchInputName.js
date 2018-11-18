// @format

'use strict';

g.launch.launchInputName = (auth) => {
  const $inputName = $('#js-launch .js-input-name');

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
    console.log(
      'launchInputName: POST -> /ajax/launchState/playerNamePost',
      data
    );
    $.post('/ajax/launchState/playerNamePost' + auth.uri, data);
  }
};
