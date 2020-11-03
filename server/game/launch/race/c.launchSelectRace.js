// @format

'use strict';

// What does this module do?
// It listens to user race select, and sends updates to server after player has selected
g.autoload.launchSelectRace = (inject) => {
  const $body = inject.$body;
  const auth = inject.auth;

  const $selectRace = $body.find('.js-launch .js-select-race');

  (function init() {
    selectRaceOn();
  })();

  function selectRaceOn() {
    $selectRace.on('change', () => {
      sendPost();
    });
  }

  function sendPost() {
    const data = {
      playerRace: $selectRace.val()
    };
    console.log('sendPost: data.playerRace:', data.playerRace);

    $.post('/ajax/launchRacePost' + auth.uri, data, () => {
      console.log('launchSelectRace: POST -> /ajax/launchRacePost', data);
    });
  }
};
