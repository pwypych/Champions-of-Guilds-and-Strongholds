// @format

'use strict';

// What does this module do?
// Checks if every player is ready in launchState and starts (and clears) countdown interval
g.autoload.launchCountdown = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  const $countdown = $body.find('[data-launch] [data-countdown]');

  let isCountDownRunning = false;

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'launchTable.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];
        if (gameEntity.state !== 'launchState') {
          return;
        }

        checkEveryPlayerReady();
      },
      false
    );
  }

  function checkEveryPlayerReady() {
    let isEveryPlayerReady = true;

    _.forEach(freshEntities(), (entity) => {
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
