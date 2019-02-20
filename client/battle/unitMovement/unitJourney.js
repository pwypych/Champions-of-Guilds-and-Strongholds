// @format

'use strict';

// What does this module do
// It listens to unitPathAccepted_ events, sends path to server
g.battle.unitJourney = (walkie, auth) => {
  (function init() {
    onPathAccepted();
  })();

  function onPathAccepted() {
    walkie.onEvent('unitPathAccepted_', 'unitJourney.js', (data) => {
      const unitPath = data.pathArray;
      const unitId = data.unitId;

      $('body').css('cursor', 'wait');

      sendRequest(unitPath, unitId);
    });
  }

  function sendRequest(unitPath, unitId) {
    const data = { unitPath: unitPath, unitId: unitId };
    $.post('/ajax/battle/unitMovement/unitPathPost' + auth.uri, data, () => {
      console.log('unitJourney.js: POST unitPathPost');

      setTimeout(() => {
        $('body').css('cursor', 'default');
      }, 500);
    });
  }
};
