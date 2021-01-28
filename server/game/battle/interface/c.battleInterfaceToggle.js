// @format

'use strict';

// What does this module do?
// Toggles battle interface (buttons etc.)
g.autoload.battleInterfaceToggle = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;

  const $buttons = $body.find('[data-battle-interface]');

  (function init() {
    onStateChange();
  })();

  function onStateChange() {
    walkie.onEvent(
      'stateChange_',
      'battleInterfaceToggle.js',
      (state) => {
        if (state === 'battleState') {
          $buttons.show();
        } else {
          $buttons.hide();
        }
      },
      false
    );
  }
};
