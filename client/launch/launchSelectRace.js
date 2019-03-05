// @format

'use strict';

g.launch.launchSelectRace = ($body, auth) => {
  const $selectRace = $body.find('#js-launch .js-select-race');

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

    $.post('/ajax/launch/race/playerRacePost' + auth.uri, data, () => {
      console.log(
        'launchSelectRace: POST -> /ajax/launch/race/playerRacePost',
        data
      );
    });
  }
};
