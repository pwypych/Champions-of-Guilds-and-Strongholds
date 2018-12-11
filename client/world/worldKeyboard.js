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
      const pavement = [];
      const keyboardMap = { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40 };

      if (event.which === keyboardMap.LEFT) {
        pavement.push({
          fromX: heroX,
          fromY: heroY,
          toX: heroX - 1,
          toY: heroY
        });
        pavement.push({
          fromX: heroX - 1,
          fromY: heroY,
          toX: heroX - 2,
          toY: heroY
        });
        pavement.push({
          fromX: heroX - 2,
          fromY: heroY,
          toX: heroX - 2,
          toY: heroY - 1
        });
      }

      if (event.which === keyboardMap.RIGHT) {
        pavement.push({
          fromX: heroX,
          fromY: heroY,
          toX: heroX + 1,
          toY: heroY
        });
        pavement.push({
          fromX: heroX + 1,
          fromY: heroY,
          toX: heroX + 2,
          toY: heroY
        });
        pavement.push({
          fromX: heroX + 2,
          fromY: heroY,
          toX: heroX + 2,
          toY: heroY + 1
        });
      }

      if (event.which === keyboardMap.UP) {
        pavement.push({
          fromX: heroX,
          fromY: heroY,
          toX: heroX,
          toY: heroY - 1
        });
        pavement.push({
          fromX: heroX,
          fromY: heroY - 1,
          toX: heroX,
          toY: heroY - 2
        });
        pavement.push({
          fromX: heroX,
          fromY: heroY - 2,
          toX: heroX + 1,
          toY: heroY - 2
        });
      }

      if (event.which === keyboardMap.DOWN) {
        pavement.push({
          fromX: heroX,
          fromY: heroY,
          toX: heroX,
          toY: heroY + 1
        });
        pavement.push({
          fromX: heroX,
          fromY: heroY + 1,
          toX: heroX,
          toY: heroY + 2
        });
        pavement.push({
          fromX: heroX,
          fromY: heroY + 2,
          toX: heroX - 1,
          toY: heroY + 2
        });
      }

      if (!_.isEmpty(pavement)) {
        sendRequest(pavement);
      }
    });

    function sendRequest(pavement) {
      const data = { heroPavement: pavement };
      console.log('pavement', pavement);
      $.post(
        '/ajax/worldState/hero/heroPavementGet' + auth.uri,
        data,
        () => {}
      );
    }
  }
};
