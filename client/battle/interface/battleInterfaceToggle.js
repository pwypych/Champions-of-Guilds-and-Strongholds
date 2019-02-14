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
          console.log('battleInterfaceToggle.js: show $buttons');
          $buttons.show();
        } else {
          console.log('battleInterfaceToggle.js: hide $buttons');
          $buttons.hide();
        }
      },
      true
    );
  }
};
