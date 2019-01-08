// @format

'use strict';

g.launch.launchToggle = ($body, walkie) => {
  const $launch = $body.find('#js-launch');

  (function init() {
    onStateChange();
  })();

  function onStateChange() {
    walkie.onEvent(
      'stateChange_',
      'launchToggle.js',
      (state) => {
        if (state === 'launchState') {
          console.log('launchToggle.js: show $launch');
          $launch.show();
        } else {
          console.log('launchToggle.js: hide $launch');
          $launch.hide();
        }
      },
      false
    );
  }
};
