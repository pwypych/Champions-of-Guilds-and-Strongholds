// @format

'use strict';

// What does this module do
// It listens to pathAccepted_ events, converts to journey and posts it to server
g.world.worldJourney = (walkie, auth) => {
  (function init() {
    onPathAccepted();
  })();

  function onPathAccepted() {
    walkie.onEvent('pathAccepted_', 'worldJourney.js', (data) => {
      const pathArray = data.pathArray;
      convertPathToJourney(pathArray);
    });
  }

  function convertPathToJourney(pathArray) {
    const journey = [];
    pathArray.forEach((pointFrom, index) => {
      if (index === pathArray.length - 1) {
        return;
      }

      const pointTo = pathArray[index + 1];

      journey.push({
        fromX: pointFrom.x,
        fromY: pointFrom.y,
        toX: pointTo.x,
        toY: pointTo.y
      });
    });

    sendRequest(journey);
  }

  function sendRequest(journey) {
    const data = { heroJourney: journey };
    $.post('/ajax/worldState/hero/heroJourneyPost' + auth.uri, data, () => {});
  }
};
