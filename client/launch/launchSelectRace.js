// @format

'use strict';

g.launch.launchSelectRace = ($body, auth) => {
  const $selectRace = $body.find('#js-launch .js-select-race');

  (function init() {
    inputNameOn();
  })();

  function inputNameOn() {
    $selectRace.on('change', () => {
      console.log('launchSelectRace: race changeg!');
      sendPost();
    });
  }

  function sendPost() {
    const data = {
      playerRace: $selectRace.val()
    };
    console.log('sendPost: data.playerRace:', data.playerRace);

    $.post('/ajax/launch/name/playerRacePost' + auth.uri, data, () => {
      console.log(
        'launchSelectRace: POST -> /ajax/launch/playerRacePost',
        data
      );
    });
  }
};
