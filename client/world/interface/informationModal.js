// @format

'use strict';

g.world.informationModal = ($body, walkie, freshEntities) => {
  const $modal = $body.find('.js-world-interface-information-modal');
  const $gold = $modal.find('.js-gold');
  const $wood = $modal.find('.js-wood');
  const $stone = $modal.find('.js-stone');
  const $crystal = $modal.find('.js-crystal');
  const $movement = $modal.find('.js-movement');
  const $recruitUnit = $modal.find('.js-recruit-unit');

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

    const movement = hero.heroStats.movement;
    const movementMax = hero.heroStats.movementMax;

    const percent = Math.ceil((movement * 100) / movementMax);

    $movement.css('width', percent);

    updateUnitAmounts(hero);
  }

  function updateUnitAmounts(hero) {
    _.forEach(hero.unitCounts, (count, unitName) => {
      const $amount = $recruitUnit.find(
        ".js-unit-amount[data-unit-name='" + unitName + "']"
      );
      $amount.text(count);
    });
  }
};
