// @format

'use strict';

g.autoload.launchToggle = (inject) => {
  const walkie = inject.walkie;
  const $body = inject.$body;

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
