// @format

'use strict';

g.world.castleButton = ($body) => {
  const $button = $body.find('.js-world-interface-castle-button');
  const $modal = $body.find('.js-world-interface-castle-modal');

  (function init() {
    onClick();
  })();

  function onClick() {
    $button.on('click', () => {
      $modal.toggle();
    });
  }
};
