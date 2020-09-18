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
        if (state !== 'launchState') {
          $launch.hide();
          return;
        }

        $launch.show();
        triggerViewportLaunchReady();
      },
      false
    );
  }

  function triggerViewportLaunchReady() {
    walkie.triggerEvent('viewportLaunchReady_', 'launchToggle.js', {}, true);
  }
};
