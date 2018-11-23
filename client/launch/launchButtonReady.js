// @format

'use strict';

g.launch.launchButtonReady = ($body, auth) => {
  const $button = $body.find('#js-launch .js-button-ready');

  (function init() {
    buttonOnClick();
  })();

  function buttonOnClick() {
    $button.on('click', () => {
      sendPost();
    });
  }

  function sendPost() {
    const data = {
      playerReady: 'yes'
    };

    $.post('/ajax/launchState/playerReadyPost' + auth.uri, data, () => {
      console.log(
        'launchButtonReady: POST -> /ajax/launchState/playerReadyPost',
        data
      );
    });
  }
};
