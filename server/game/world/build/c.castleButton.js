// @format

'use strict';

g.autoload.castleButton = (inject) => {
  const $body = inject.$body;

  const $modal = $body.find('[data-world-interface-fortification-modal]');
  const $button = $body.find('.js-world-interface-castle-button');

  (function init() {
    onClick();
  })();

  function onClick() {
    $button.on('click', () => {
      $modal.toggle();
    });
  }
};
