// @format

'use strict';

g.world.informationModal = ($body, walkie, freshEntities) => {
  const $modal = $body.find('#js-information-modal');
  const $gold = $modal.find('.js-information-modal-gold');
  const $wood = $modal.find('.js-information-modal-wood');
  const $stone = $modal.find('.js-information-modal-stone');
  const $crystal = $modal.find('.js-information-modal-crystal');
  const $movement = $modal.find('.js-information-modal-movement');
  const $units = $modal.find('.js-information-modal-units');

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

    displayUnits(hero);
  }

  function displayUnits(hero) {
    _.forEach(hero.unitCounts, (unitCount, figureName) => {
      // const $img = $('<img>');
    });
  }
};
