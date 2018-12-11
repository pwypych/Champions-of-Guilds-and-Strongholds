// @format

'use strict';

// What does this module do
// It listens to pathAccepted_ events, converts to pavement and posts it to server
g.world.worldPavement = (walkie, auth) => {
  (function init() {
    onPathAccepted();
  })();

  function onPathAccepted() {
    walkie.onEvent('pathAccepted_', 'worldPavement.js', (data) => {
      const pathArray = data.pathArray;
      convertPathToPavement(pathArray);
    });
  }

  function convertPathToPavement(pathArray) {
    const pavement = [];
    pathArray.forEach((pointFrom, index) => {
      if (index === pathArray.length - 1) {
        return;
      }

      const pointTo = pathArray[index + 1];

      pavement.push({
        fromX: pointFrom.x,
        fromY: pointFrom.y,
        toX: pointTo.x,
        toY: pointTo.y
      });
    });

    sendRequest(pavement);
  }

  function sendRequest(pavement) {
    const data = { heroPavement: pavement };
    $.post('/ajax/worldState/hero/heroPavementPost' + auth.uri, data, () => {});
  }
};
