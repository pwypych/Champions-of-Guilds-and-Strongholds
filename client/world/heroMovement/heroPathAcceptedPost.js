// @format

'use strict';

// What does this module do
// It listens to heroPathAccepted_ events, sends path to server
g.world.heroPathAcceptedPost = (walkie, auth) => {
  (function init() {
    onPathAccepted();
  })();

  function onPathAccepted() {
    walkie.onEvent('heroPathAccepted_', 'heroPathAcceptedPost.js', (data) => {
      const path = data.path;
      const entityId = data.heroId;

      sendRequest(path, entityId);
    });
  }

  function sendRequest(path, entityId) {
    const data = { path: path, entityId: entityId };
    $.post('/ajax/world/movement/pathPost' + auth.uri, data, (response) => {
      console.log('heroPathAcceptedPost.js: POST pathPost', response);

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
