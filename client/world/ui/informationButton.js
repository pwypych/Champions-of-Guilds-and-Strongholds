// @format

'use strict';

g.world.informationButton = ($body) => {
  const $button = $body.find('#js-information-button');
  const $modal = $body.find('#js-information-modal');

  (function init() {
    onClick();
  })();

  function onClick() {
    $button.on('click', () => {
      $modal.toggle();
    });
  }
};
