// @format

'use strict';

g.common.keyboardSaveLoad = (walkie, auth) => {
  (function init() {
    addListener();
  })();

  function addListener() {
    $(document).keydown((event) => {
      const keyboardMap = { 49: 'one', 48: 'zero' };
      const keyPressed = keyboardMap[event.which];

      if (!keyPressed) {
        return;
      }

      scanKeys(keyPressed);
    });
  }

  function scanKeys(keyPressed) {
    if (keyPressed === 'one') {
      loadGamePost();
    } else if (keyPressed === 'zero') {
      saveGamePost();
    }
  }

  function loadGamePost() {
    const data = { gameId: auth.gameId };
    console.log('loadGamePost');
    $.post('/panel/loadGamePost' + auth.uri, data, (response) => {
      console.log('loadGamePost():response.length:', response);
      walkie.triggerEvent(
        'chatMessage_',
        'keyboardSaveLoad',
        { message: 'Game loaded.' },
        false
      );
    });
  }

  function saveGamePost() {
    const data = { gameId: auth.gameId };
    console.log('saveGamePost()');
    $.post('/panel/saveGamePost' + auth.uri, data, (response) => {
      console.log('saveGamePost():response.length:', response);
      walkie.triggerEvent(
        'chatMessage_',
        'keyboardSaveLoad',
        { message: 'Game saved.' },
        false
      );
    });
  }
};
