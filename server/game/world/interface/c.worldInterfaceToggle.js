// @format

'use strict';

g.autoload.worldInterfaceToggle = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;

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
