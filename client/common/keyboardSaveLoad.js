// @format

'use strict';

g.common.keyboardSaveLoad = (walkie, auth) => {
  (function init() {
    addListener();
  })();

  function addListener() {
    $(document).keydown((event) => {
      console.log('keyboardSaveLoad:keydown');
      const keyboardMap = { 49: 'one', 48: 'zero' };
      const keyPressed = keyboardMap[event.which];

      console.log('keyPressed', keyPressed);
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
      console.log('loadGamePost():response.length:', response.length);
    });
  }

  function saveGamePost() {
    const data = { gameId: auth.gameId };
    console.log('saveGamePost()');
    $.post('/panel/saveGamePost' + auth.uri, data, (response) => {
      console.log('saveGamePost():response.length:', response.length);
    });
  }
};
