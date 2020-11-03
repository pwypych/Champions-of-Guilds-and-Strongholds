// @format

'use strict';

// What does this module do?
// Checks if every player is ready in launchState and starts countdown interval
g.autoload.launchCountdown = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;

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
    const timer = setInterval(() => {
      $countdown.text(count);
      count -= 1;
      if (count === 0) {
        clearInterval(timer);
      }
    }, 1000);
  }
};
