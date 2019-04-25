// @format

'use strict';

g.launch.launchCountdown = ($body, walkie) => {
  const $countdown = $body.find('.js-launch .js-countdown');

  let isCountDownRunning = false;

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'launchTable.js',
      (entities) => {
        if (entities[entities._id].state === 'launchState') {
          checkEveryPlayerReady(entities);
        }
      },
      false
    );
  }

  function checkEveryPlayerReady(entities) {
    let isEveryPlayerReady = true;

    _.forEach(entities, (entity) => {
      if (entity.playerData) {
        if (!entity.readyForLaunch) {
          isEveryPlayerReady = false;
        }
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
