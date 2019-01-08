// @format

'use strict';

g.common.canvasWrapperToggle = ($body, walkie) => {
  const $canvasWrapper = $body.find('#js-canvas-wrapper');

  (function init() {
    onStateChange();
  })();

  function onStateChange() {
    walkie.onEvent(
      'stateChange_',
      'canvasWrapperToggle.js',
      (state) => {
        if (state === 'worldState' || state === 'battleState') {
          console.log('canvasWrapperToggle.js: show $canvasWrapper');
          $canvasWrapper.show();
        } else {
          console.log('canvasWrapperToggle.js: hide $canvasWrapper');
          $canvasWrapper.hide();
        }
      },
      false
    );
  }
};
