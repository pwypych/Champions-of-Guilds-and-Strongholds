// @format

'use strict';

// What does this module do?
// Updates data in information modal
g.autoload.informationModal = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  const $modal = $body.find('[data-world-interface-information-modal]');
  const $gold = $modal.find('[data-gold]');
  const $wood = $modal.find('[data-wood]');
  const $stone = $modal.find('[data-stone]');
  const $crystal = $modal.find('[data-crystal]');
  const $movement = $modal.find('[data-movement]');
  const $recruitUnit = $modal.find('[data-recruit-unit]');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'informationModal.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'worldState') {
          return;
        }

        findPlayerId();
      },
      false
    );
  }

  function findPlayerId() {
    let playerId;
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.playerCurrent) {
        playerId = id;
      }
    });

    displayResources(playerId);
  }

  function displayResources(playerId) {
    const player = freshEntities()[playerId];
    $gold.text(player.playerResources.gold);
    $wood.text(player.playerResources.wood);
    $stone.text(player.playerResources.stone);
    $crystal.text(player.playerResources.crystal);

    displayMovement(playerId);
  }

  function displayMovement(playerId) {
    let hero;
    _.forEach(freshEntities(), (entity) => {
      if (entity.heroStats && entity.owner === playerId) {
        hero = entity;
      }
    });

    const movementCurrent = hero.heroStats.current.movement;
    const movementBase = hero.heroStats.base.movement;

    const percent = Math.ceil((movementCurrent * 100) / movementBase);

    $movement.css('width', percent);

    updateUnitAmounts(hero);
  }

  function updateUnitAmounts(hero) {
    _.forEach(hero.unitAmounts, (count, unitName) => {
      const $amount = $recruitUnit.find(
        "[data-unit-amount][data-unit-name='" + unitName + "']"
      );
      $amount.text(count);
    });
  }
};
