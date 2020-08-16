// @format

'use strict';

g.battle.battleInterfaceToggle = ($body, walkie) => {
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
