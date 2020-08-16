// @format

'use strict';

g.world.worldInterfaceToggle = ($body, walkie) => {
  const $buttons = $body.find('.js-world-interface-buttons');

  (function init() {
    onStateChange();
  })();

  function onStateChange() {
    walkie.onEvent(
      'stateChange_',
      'worldInterfaceToggle.js',
      (state) => {
        if (state === 'worldState') {
          $buttons.show();
        } else {
          $buttons.hide();
        }
      },
      false
    );
  }
};
