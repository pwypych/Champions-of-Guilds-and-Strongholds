// @format

'use strict';

g.world.worldKeyboard = (walkie, auth) => {
  let heroY;
  let heroX;

  (function init() {
    onStateDataGet();
    onStateChange();
  })();

  function onStateDataGet() {
    walkie.onEvent(
      'stateDataGet_',
      'worldKeyboard',
      (stateData) => {
        if (stateData.state === 'worldState') {
          findHeroYX(stateData);
        }
      },
      false
    );
  }

  function findHeroYX(stateData) {
    const playerArray = stateData.playerArray;
    const playerIndex = stateData.playerIndex;

    heroX = parseInt(playerArray[playerIndex].hero.x, 10);
    heroY = parseInt(playerArray[playerIndex].hero.y, 10);
  }

  function onStateChange() {
    walkie.onEvent('stateChange_', 'worldKeyboard.js', (state) => {
      if (state === 'worldState') {
        addListeners();
      }
      // @todo remove listeners on other state
    });
  }

  function addListeners() {
    $(document).keydown((event) => {
      let moveToY;
      let moveToX;

      if (event.which === 37) {
        moveToY = heroY;
        moveToX = heroX - 1;
      }

      if (event.which === 38) {
        moveToY = heroY - 1;
        moveToX = heroX;
      }

      if (event.which === 39) {
        moveToY = heroY;
        moveToX = heroX + 1;
      }

      if (event.which === 40) {
        moveToY = heroY + 1;
        moveToX = heroX;
      }

      if (typeof moveToY !== 'undefined' && typeof moveToX !== 'undefined') {
        sendRequest(moveToY, moveToX);
      }
    });

    function sendRequest(moveToY, moveToX) {
      const data = {
        moveToY: moveToY,
        moveToX: moveToX
      };

      $.post('/ajax/worldState/hero/moveToPost' + auth.uri, data, () => {
        triggerHeroMoveTo(moveToY, moveToX);
      });
    }

    function triggerHeroMoveTo(moveToY, moveToX) {
      walkie.triggerEvent('heroMoveTo_', 'worldKeyboard', {
        moveToY: moveToY,
        moveToX: moveToX
      });
    }
  }

  // wait on tick?
  // run animation
};
