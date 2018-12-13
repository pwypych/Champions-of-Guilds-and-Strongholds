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
      const journey = [];
      const keyboardMap = { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40, SPACE: 32 };

      if (event.which === keyboardMap.LEFT) {
        journey.push({
          fromX: heroX,
          fromY: heroY,
          toX: heroX - 1,
          toY: heroY
        });
      }

      if (event.which === keyboardMap.RIGHT) {
        journey.push({
          fromX: heroX,
          fromY: heroY,
          toX: heroX + 1,
          toY: heroY
        });
      }

      if (event.which === keyboardMap.UP) {
        journey.push({
          fromX: heroX,
          fromY: heroY,
          toX: heroX,
          toY: heroY - 1
        });
      }

      if (event.which === keyboardMap.DOWN) {
        journey.push({
          fromX: heroX,
          fromY: heroY,
          toX: heroX,
          toY: heroY + 1
        });
      }

      if (event.which === keyboardMap.SPACE) {
        postHeroJourneyCancel(journey);
        return;
      }

      if (!_.isEmpty(journey)) {
        postHeroJourney(journey);
      }
    });

    function postHeroJourney(journey) {
      const data = { heroJourney: journey };
      console.log('journey', journey);
      $.post(
        '/ajax/worldState/hero/heroJourneyPost' + auth.uri,
        data,
        () => {}
      );
    }

    function postHeroJourneyCancel() {
      const data = { heroJourneyCancel: 'true' };
      $.post(
        '/ajax/worldState/hero/heroJourneyCancelPost' + auth.uri,
        data,
        () => {}
      );
    }
  }
};
