// @format

'use strict';

// What does this module do
// It listens to pathAccepted_ events, sends path to server
g.battle.unitAcceptedPathPost = (walkie, auth) => {
  (function init() {
    onPathAccepted();
  })();

  function onPathAccepted() {
    walkie.onEvent('pathAccepted_', 'unitAcceptedPathPost.js', (data) => {
      const path = data.path;
      const unitId = data.unitId;

      sendRequest(path, unitId);
    });
  }

  function sendRequest(path, unitId) {
    const data = { path: path, entityId: unitId };
    $.post('/ajax/movement/pathPost' + auth.uri, data, (response) => {
      console.log('unitAcceptedPathPost.js: POST pathPost', response);

      if (response && response.path) {
        const responseUnitPath = response.path;
        triggerUnitPathVerifiedByServer(unitId, responseUnitPath);
      }
    });
  }

  function triggerUnitPathVerifiedByServer(unitId, responseUnitPath) {
    walkie.triggerEvent('movementPathVerifiedByServer_', 'battleClick.js', {
      entityId: unitId,
      path: responseUnitPath
    });
  }
};
