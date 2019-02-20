// @format

'use strict';

// What does this module do
// It listens to unitPathAccepted_ events, sends path to server
g.battle.unitAcceptedPathPost = (walkie, auth) => {
  (function init() {
    onPathAccepted();
  })();

  function onPathAccepted() {
    walkie.onEvent('unitPathAccepted_', 'unitAcceptedPathPost.js', (data) => {
      const unitPath = data.pathArray;
      const unitId = data.unitId;

      sendRequest(unitPath, unitId);
    });
  }

  function sendRequest(unitPath, unitId) {
    const data = { unitPath: unitPath, unitId: unitId };
    $.post(
      '/ajax/battle/unitMovement/unitPathPost' + auth.uri,
      data,
      (response) => {
        console.log('unitAcceptedPathPost.js: POST unitPathPost', response);

        if (response && response.unitPath) {
          triggerUnitPathVerifiedByServer(unitId, unitPath);
        }
      }
    );
  }

  function triggerUnitPathVerifiedByServer(unitId, unitPath) {
    walkie.triggerEvent('unitPathVerifiedByServer_', 'battleClick.js', {
      unitId: unitId,
      unitPath: unitPath
    });
  }
};
