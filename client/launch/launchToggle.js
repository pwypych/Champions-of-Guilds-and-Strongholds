// @format

'use strict';

g.launch.launchToggle = ($body, walkie) => {
  const $launch = $body.find('.js-launch');

  (function init() {
    onStateChange();
  })();

  function onStateChange() {
    walkie.onEvent(
      'stateChange_',
      'launchToggle.js',
      (state) => {
        if (state === 'launchState') {
          $launch.show();
        } else {
          $launch.hide();
        }
      },
      false
    );
  }
};
