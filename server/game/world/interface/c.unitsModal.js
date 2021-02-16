// @format

'use strict';

// What does this module do?
// Updates data in units modal
g.autoload.unitsModal = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  const $modal = $body.find('[data-world-interface-units-modal]');
  const $recruitUnit = $modal.find('[data-recruit-unit]');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGetEvent_',
      'unitsModal.js',
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

    updateUnitAmounts(playerId);
  }

  function updateUnitAmounts(playerId) {
    let hero;
    _.forEach(freshEntities(), (entity) => {
      if (entity.heroStats && entity.owner === playerId) {
        hero = entity;
      }
    });

    _.forEach(hero.unitAmounts, (count, unitName) => {
      const $amount = $recruitUnit.find(
        "[data-unit-amount][data-unit-name='" + unitName + "']"
      );
      $amount.text(count);
    });
  }
};
