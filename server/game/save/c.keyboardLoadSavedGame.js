// @format

'use strict';

// What does this module do?
// It listens to keypress of "1" or "0" keyboard button and loads previous or next save (game is saved after every move)
g.autoload.keyboardLoadSavedGame = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

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
    $.post('/panelRandom/loadGamePost' + auth.uri, data, (response) => {
      console.log('loadPreviousSavedGamePost():response.length:', response);
      walkie.triggerEvent(
        'chatMessageEvent_',
        'keyboardLoadSavedGame',
        { message: 'Game loaded.' },
        false
      );
      window.location.reload(true);
    });
  }

  function loadNextSavedGamePost() {
    const data = { gameId: auth.gameId, direction: 'next' };
    console.log('loadNextSavedGamePost()');
    $.post('/panelRandom/loadGamePost' + auth.uri, data, (response) => {
      console.log('loadNextSavedGamePost():response.length:', response);
      walkie.triggerEvent(
        'chatMessageEvent_',
        'keyboardLoadSavedGame',
        { message: 'Game saved.' },
        false
      );
      window.location.reload(true);
    });
  }
};
