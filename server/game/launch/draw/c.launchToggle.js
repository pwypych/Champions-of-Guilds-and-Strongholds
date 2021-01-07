// @format

'use strict';

// What does this module do?
// Shows launch table and UI when in launchState, hides it in other states
g.autoload.launchToggle = (inject) => {
  const walkie = inject.walkie;
  const $body = inject.$body;

  const $launch = $body.find('[data-launch]');

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
