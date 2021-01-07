// @format

'use strict';

// What does this module do?
// Shows canvas on world and battle states, hides it on other states
g.autoload.canvasWrapperToggle = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;

  const $canvasWrapper = $body.find('[data-canvas-wrapper]');

  (function init() {
    onStateChange();
  })();

  function onStateChange() {
    walkie.onEvent(
      'stateChange_',
      'canvasWrapperToggle.js',
      (state) => {
        if (state === 'worldState' || state === 'battleState') {
          $canvasWrapper.show();
        } else {
          $canvasWrapper.hide();
        }
      },
      false
    );
  }
};
