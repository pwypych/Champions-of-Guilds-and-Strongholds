// @format

'use strict';

// What does this module do
// It listens to unitPathAccepted_ events, converts to journey and posts it to server
g.battle.unitJourney = (walkie, auth) => {
  let journeyQueuedToSend;
  let unitIdQueuedToSend;

  (function init() {
    onPathAccepted();
    onEntitiesGet();
  })();

  function onPathAccepted() {
    walkie.onEvent('unitPathAccepted_', 'unitJourney.js', (data) => {
      const pathArray = data.pathArray;
      const unitId = data.unitId;

      $('body').css('cursor', 'wait');

      convertPathToJourney(pathArray, unitId);
    });
  }

  function convertPathToJourney(pathArray, unitId) {
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

    journeyQueuedToSend = journey;
    unitIdQueuedToSend = unitId;
  }

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'unitJourney.js',
      () => {
        if (journeyQueuedToSend && unitIdQueuedToSend) {
          sendRequest(journeyQueuedToSend, unitIdQueuedToSend);
        }
      },
      false
    );
  }

  function sendRequest(journey, unitId) {
    journeyQueuedToSend = undefined;
    unitIdQueuedToSend = undefined;

    const data = { unitJourney: journey, unitId: unitId };
    $.post('/ajax/battle/journey/maneuverJourneyPost' + auth.uri, data, () => {
      console.log('unitJourney.js: POST maneuverJourneyPost');

      setTimeout(() => {
        $('body').css('cursor', 'default');
      }, 500);
    });
  }
};
