// @format

'use strict';

g.world.interfaceWorldToggle = ($body, walkie) => {
  const $interfaceWorld = $body.find('#js-interface-world');

  (function init() {
    onStateChange();
  })();

  function onStateChange() {
    walkie.onEvent(
      'stateChange_',
      'interfaceWorldToggle.js',
      (state) => {
        if (state === 'worldState') {
          console.log('canvasWrapperToggle.js: show $interfaceWorld');
          $interfaceWorld.show();
        } else {
          console.log('canvasWrapperToggle.js: hide $interfaceWorld');
          $interfaceWorld.hide();
        }
      },
      false
    );
  }
};
