// @format

'use strict';

// What does this module do
// It listens to pathAccepted_ events, converts to journey and posts it to server
g.world.heroJourney = (walkie, auth) => {
  let journeyQueuedToSend;
  let heroIdQueuedToSend;

  (function init() {
    onPathAccepted();
    onEntitiesGet();
  })();

  function onPathAccepted() {
    walkie.onEvent('pathAccepted_', 'heroJourney.js', (data) => {
      const pathArray = data.pathArray;
      const heroId = data.heroId;

      $('body').css('cursor', 'wait');

      convertPathToJourney(pathArray, heroId);
    });
  }

  function convertPathToJourney(pathArray, heroId) {
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
    heroIdQueuedToSend = heroId;
  }

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'heroJourney.js',
      () => {
        if (journeyQueuedToSend && heroIdQueuedToSend) {
          sendRequest(journeyQueuedToSend, heroIdQueuedToSend);
        }
      },
      false
    );
  }

  function sendRequest(journey, heroId) {
    journeyQueuedToSend = undefined;
    heroIdQueuedToSend = undefined;

    const data = { heroJourney: journey, heroId: heroId };
    $.post('/ajax/world/journey/heroJourneyPost' + auth.uri, data, () => {
      console.log('worldJourney.js: POST heroJourneyPost');

      setTimeout(() => {
        $('body').css('cursor', 'default');
      }, 500);
    });
  }
};
