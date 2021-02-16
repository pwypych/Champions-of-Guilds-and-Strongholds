// @format

'use strict';

// What does this module do?
// It listens to units button clicks and toggles units modal
g.autoload.unitsButton = (inject) => {
  const $body = inject.$body;

  const $button = $body.find('[data-world-interface-units-button]');
  const $modal = $body.find('[data-world-interface-units-modal]');

  (function init() {
    onClick();
  })();

  function onClick() {
    $button.on('click', () => {
      $modal.toggle();
    });
  }
};
