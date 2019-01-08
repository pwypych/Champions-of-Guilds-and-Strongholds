// @format

'use strict';

g.battle.battleToggle = ($body, walkie) => {
  const $world = $body.find('#js-world');

  (function init() {
    onStateChange();
  })();

  function onStateChange() {
    walkie.onEvent(
      'stateChange_',
      'battleToggle.js',
      (state) => {
        if (state === 'battleState') {
          console.log('battleToggle.js: show $world');
          $world.show();
        } else {
          console.log('battleToggle.js: hide $world');
          $world.hide();
        }
      },
      false
    );
  }
};
