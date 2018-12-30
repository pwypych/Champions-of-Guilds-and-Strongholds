// @format

'use strict';

g.world.informationModal = ($body, walkie, freshEntities) => {
  const $modal = $body.find('#js-information-modal');
  const $gold = $modal.find('.js-information-modal-gold');
  const $wood = $modal.find('.js-information-modal-wood');
  const $stone = $modal.find('.js-information-modal-stone');
  const $crystal = $modal.find('.js-information-modal-crystal');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'worldToggle.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'worldState') {
          return;
        }

        displayResources();
      },
      false
    );
  }

  function displayResources() {
    const player = _.find(freshEntities(), 'playerCurrent');
    $gold.text(player.playerResources.gold);
    $wood.text(player.playerResources.wood);
    $stone.text(player.playerResources.stone);
    $crystal.text(player.playerResources.crystal);
  }
};
