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
      const moveArray = [];

      if (event.which === 37) {
        moveArray.push([heroX - 1, heroY]);
        moveArray.push([heroX - 2, heroY]);
        moveArray.push([heroX - 2, heroY - 1]);
      }

      if (event.which === 38) {
        moveArray.push([heroX, heroY - 1]);
        moveArray.push([heroX, heroY - 2]);
        moveArray.push([heroX - 1, heroY - 2]);
      }

      if (event.which === 39) {
        moveArray.push([heroX + 1, heroY]);
        moveArray.push([heroX + 2, heroY]);
        moveArray.push([heroX + 2, heroY + 1]);
      }

      if (event.which === 40) {
        moveArray.push([heroX, heroY + 1]);
        moveArray.push([heroX, heroY + 2]);
        moveArray.push([heroX + 1, heroY + 2]);
      }

      if (!_.isEmpty(moveArray)) {
        sendRequest(moveArray);
      }
    });

    function sendRequest(moveArray) {
      const data = { moveArray: moveArray };
      console.log('moveArray', moveArray);
      $.post('/ajax/worldState/hero/moveToPost' + auth.uri, data, () => {
        triggerHeroMoveTo(moveArray);
      });
    }

    function triggerHeroMoveTo(moveArray) {
      // walkie.triggerEvent('heroMoveTo_', 'worldKeyboard', {
      // });
    }
  }

  // wait on tick?
  // run animation
};
