// @format

'use strict';

g.autoload.battleInterfaceToggle = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;

  const $buttons = $body.find('.js-battle-interface-maneuver-buttons');

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
