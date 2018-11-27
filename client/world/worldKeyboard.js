// @format

'use strict';

g.world.worldKeyboard = (walkie, auth) => {
  let heroY;
  let heroX;

  (function init() {
    onStateChange();
    onStateDataGet();
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
    const mapLayer = stateData.mapLayer;
    const playerIndex = stateData.playerIndex;

    mapLayer.forEach((row, y) => {
      row.forEach((figure, x) => {
        if (figure.type === 'hero' && figure.playerIndex === playerIndex) {
          heroY = y;
          heroX = x;
          // console.log('heroFoundOn', y, x);
        }
      });
    });
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

      $.post('/ajax/worldState/hero/moveTo' + auth.uri, data, (responce) => {
        console.log('sendRequest: responce:', responce);
      });
    }
  }

  // wait on tick?
  // run animation
};
