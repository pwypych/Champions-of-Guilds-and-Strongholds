// @format

'use strict';

g.world.worldInterfaceToggle = ($body, walkie) => {
  const $worldInterface = $body.find('#js-world-interface');

  (function init() {
    onStateChange();
  })();

  function onStateChange() {
    walkie.onEvent(
      'stateChange_',
      'worldInterfaceToggle.js',
      (state) => {
        if (state === 'worldState') {
          console.log('canvasWrapperToggle.js: show $worldInterface');
          $worldInterface.show();
        } else {
          console.log('canvasWrapperToggle.js: hide $worldInterface');
          $worldInterface.hide();
        }
      },
      false
    );
  }
};
