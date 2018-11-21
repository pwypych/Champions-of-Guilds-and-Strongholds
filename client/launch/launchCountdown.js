// @format

'use strict';

g.launch.launchCountdown = ($body, walkie) => {
  const $countdown = $body.find('#js-launch .js-countdown');

  let isCountDownRunning = false;

  (function init() {
    onStateDataGet();
  })();

  function onStateDataGet() {
    walkie.onEvent(
      'stateDataGet_',
      'launchTable.js',
      (stateData) => {
        if (stateData.state === 'launchState') {
          checkEveryPlayerReady(stateData.playerArray);
        }
      },
      false
    );
  }

  function checkEveryPlayerReady(playerArray) {
    let isEveryPlayerReady = true;
    playerArray.forEach((player) => {
      if (player.ready === 'no') {
        isEveryPlayerReady = false;
      }
    });

    if (isEveryPlayerReady && !isCountDownRunning) {
      runCountDown();
    }
  }

  function runCountDown() {
    console.log('launchCountdown:runCountDown()');
    isCountDownRunning = true;

    let count = 5;
    setInterval(() => {
      $countdown.text(count);
      count -= 1;
    }, 1000);
  }
};
