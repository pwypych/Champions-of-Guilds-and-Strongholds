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
          console.log('canvasWrapperToggle.js: show $buttons');
          $buttons.show();
        } else {
          console.log('canvasWrapperToggle.js: hide $buttons');
          $buttons.hide();
        }
      },
      false
    );
  }
};
