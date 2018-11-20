// @format

'use strict';

g.launch.launchButtonReady = ($body, auth) => {
  const $button = $body.find('#js-launch .js-button-ready');
  const $inputName = $body.find('#js-launch .js-input-name');

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

    console.log('sendPost');
    $.post('/ajax/launchState/playerReadyPost' + auth.uri, data, () => {
      console.log(
        'launchButtonReady: POST -> /ajax/launchState/playerReadyPost',
        data
      );

      $button.attr('disabled', 'disabled');
      $inputName.attr('disabled', 'disabled');
    });
  }
};
