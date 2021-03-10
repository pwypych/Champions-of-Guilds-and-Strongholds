// @format

'use strict';

// What does this module do
// Toggle castle modal and emmit event

g.autoload.castleButton = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;

  const $modal = $body.find('[data-world-interface-fortification-modal]');
  const $button = $body.find('[data-world-interface-castle-button]');

  (function init() {
    onClick();
  })();

  function onClick() {
    $button.on('click', () => {
      $modal.toggle();
      triggerFortificationModalToggledEvent();
    });
  }

  function triggerFortificationModalToggledEvent() {
    walkie.triggerEvent('fortificationModalToggledEvent_', 'castleButton.js');
  }
};
