// @format

'use strict';

// What does this module do
// It listens to unitPathAccepted_ events, sends path to server
g.battle.unitPathAcceptedPost = (walkie, auth) => {
  (function init() {
    onPathAccepted();
  })();

  function onPathAccepted() {
    walkie.onEvent('unitPathAccepted_', 'unitPathAcceptedPost.js', (data) => {
      const path = data.path;
      const entityId = data.unitId;

      sendRequest(path, entityId);
    });
  }

  function sendRequest(path, entityId) {
    const data = { path: path, entityId: entityId };
    $.post('/ajax/battle/movement/pathPost' + auth.uri, data, (response) => {
      console.log('unitPathAcceptedPost.js: POST pathPost', response);

      if (response && response.path) {
        const responseUnitPath = response.path;
        triggerUnitPathVerifiedByServer(entityId, responseUnitPath);
      }
    });
  }

  function triggerUnitPathVerifiedByServer(entityId, responseUnitPath) {
    walkie.triggerEvent('movementPathVerifiedByServer_', 'battleClick.js', {
      entityId: entityId,
      path: responseUnitPath
    });
  }
};
