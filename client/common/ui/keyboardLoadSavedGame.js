// @format

'use strict';

g.common.keyboardLoadSavedGame = (walkie, auth) => {
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
      loadPreviousSavedGamePost();
    } else if (keyPressed === 'zero') {
      loadNextSavedGamePost();
    }
  }

  function loadPreviousSavedGamePost() {
    const data = { gameId: auth.gameId, direction: 'previous' };
    console.log('loadPreviousSavedGamePost');
    $.post('/panel/loadGamePost' + auth.uri, data, (response) => {
      console.log('loadPreviousSavedGamePost():response.length:', response);
      walkie.triggerEvent(
        'chatMessage_',
        'keyboardLoadSavedGame',
        { message: 'Game loaded.' },
        false
      );
    });
  }

  function loadNextSavedGamePost() {
    const data = { gameId: auth.gameId, direction: 'next' };
    console.log('loadNextSavedGamePost()');
    $.post('/panel/loadGamePost' + auth.uri, data, (response) => {
      console.log('loadNextSavedGamePost():response.length:', response);
      walkie.triggerEvent(
        'chatMessage_',
        'keyboardLoadSavedGame',
        { message: 'Game saved.' },
        false
      );
    });
  }
};
