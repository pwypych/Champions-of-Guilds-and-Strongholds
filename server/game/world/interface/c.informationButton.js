// @format

'use strict';

g.autoload.informationButton = (inject) => {
  const $body = inject.$body;

  const $button = $body.find('.js-world-interface-information-button');
  const $modal = $body.find('.js-world-interface-information-modal');

  (function init() {
    onClick();
  })();

  function onClick() {
    $button.on('click', () => {
      $modal.toggle();
    });
  }
};
