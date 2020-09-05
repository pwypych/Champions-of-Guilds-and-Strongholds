// @format

'use strict';

g.autoload.castleButton = (inject) => {
  const $body = inject.$body;

  const $button = $body.find('.js-world-interface-castle-button');
  const $modal = $body.find('.js-world-interface-fortification-modal');

  (function init() {
    onClick();
  })();

  function onClick() {
    $button.on('click', () => {
      $modal.toggle();
    });
  }
};
