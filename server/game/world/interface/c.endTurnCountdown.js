// @format

'use strict';

// What does this module do?
// It listens to event, checks changes in player endTurn, runs countdown, uses chat for messages
g.autoload.endTurnCountdown = (inject) => {
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  let interval;
  let newDayMessageWasSend = true;

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'endTurnCountdown.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];
        if (gameEntity.state !== 'worldState') {
          return;
        }

        checkEndTurnFlags();
      },
      false
    );
  }

  function checkEndTurnFlags() {
    let someoneStillPlaying = false;
    _.forEach(freshEntities(), (entity) => {
      if (entity.playerData && !entity.endTurn) {
        someoneStillPlaying = true;
      }
    });

    let someoneEndedTurn = false;
    _.forEach(freshEntities(), (entity) => {
      if (entity.endTurn) {
        someoneEndedTurn = true;
      }
    });

    if (someoneEndedTurn && someoneStillPlaying) {
      // someone ended turn while others still playing
      if (!interval) {
        newDayMessageWasSend = false;
        startCountdown();
      }
    }

    if (someoneEndedTurn && !someoneStillPlaying) {
      // everybody ended turn
      clearInterval(interval);
      interval = undefined;
      newDayMessage();
    }

    if (!someoneEndedTurn && someoneStillPlaying) {
      // nobody has ended turn
      clearInterval(interval);
      interval = undefined;
      newDayMessage();
    }
  }

  function startCountdown() {
    let time = 30;
    interval = setInterval(() => {
      if (time === 30) {
        walkie.triggerEvent(
          'chatMessage_',
          'endTurnCountdown',
          { message: 'Turn will end in 30s...' },
          false
        );
      }

      if (time === 25) {
        walkie.triggerEvent(
          'chatMessage_',
          'endTurnCountdown',
          { message: 'Turn will end in 25s...' },
          false
        );
      }

      if (time === 20) {
        walkie.triggerEvent(
          'chatMessage_',
          'endTurnCountdown',
          { message: 'Turn will end in 20s...' },
          false
        );
      }

      if (time === 15) {
        walkie.triggerEvent(
          'chatMessage_',
          'endTurnCountdown',
          { message: 'Turn will end in 15s...' },
          false
        );
      }

      if (time === 10) {
        walkie.triggerEvent(
          'chatMessage_',
          'endTurnCountdown',
          { message: 'Turn will end in 10s...' },
          false
        );
      }

      if (time === 5) {
        walkie.triggerEvent(
          'chatMessage_',
          'endTurnCountdown',
          { message: 'Turn will end in 5s...' },
          false
        );
      }

      if (time === 3) {
        walkie.triggerEvent(
          'chatMessage_',
          'endTurnCountdown',
          { message: 'Turn will end in 3s...' },
          false
        );
      }

      if (time === 2) {
        walkie.triggerEvent(
          'chatMessage_',
          'endTurnCountdown',
          { message: 'Turn will end in 2s...' },
          false
        );
      }

      if (time === 1) {
        walkie.triggerEvent(
          'chatMessage_',
          'endTurnCountdown',
          { message: 'Turn will end in 1s...' },
          false
        );
      }

      if (time === 0) {
        clearInterval(interval);
        interval = undefined;
        newDayMessage();
      }

      time -= 1;
    }, 1000);
  }

  function newDayMessage() {
    if (!newDayMessageWasSend) {
      newDayMessageWasSend = true;

      walkie.triggerEvent(
        'chatMessage_',
        'endTurnCountdown.js',
        { message: 'New day has arrived. You can move now!' },
        false
      );
    }
  }
};
