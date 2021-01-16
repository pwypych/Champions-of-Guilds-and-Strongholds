// @format

'use strict';

// What does this module do?
// Shows world interface buttons when in worldState, hides them in other states
g.autoload.worldInterfaceToggle = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;

  const $buttons = $body.find('[data-world-interface-buttons]');

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
