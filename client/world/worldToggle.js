// @format

'use strict';

g.world.worldToggle = ($body, walkie) => {
  const $world = $body.find('#js-world');

  (function init() {
    onStateChange();
  })();

  function onStateChange() {
    walkie.onEvent(
      'stateChange_',
      'worldToggle.js',
      (state) => {
        if (state === 'worldState') {
          console.log('worldToggle.js: show $world');
          $world.show();
        } else {
          console.log('worldToggle.js: hide $world');
          $world.hide();
        }
      },
      false
    );
  }
};
