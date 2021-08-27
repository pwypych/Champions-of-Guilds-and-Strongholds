// @format

'use strict';

// What does this module do
// Disable recruit button if unit fortification is not builded
g.autoload.prohibitUnitFortification = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  const $modal = $body.find('[data-world-interface-units-modal]');
  const $wrapper = $modal.find('[data-recruit-unit]');

  (function init() {
    onUnitModalToggled();
    onEntitiesGet();
  })();

  function onUnitModalToggled() {
    walkie.onEvent(
      'unitModalToggledEvent_',
      'prohibitOutsideCastle.js',
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

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGetEvent_',
      'prohibitResourceless.js',
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

    findPlayerFortifications(playerId);
  }

  function findPlayerFortifications(playerId) {
    const playerFortifications = [];

    _.forEach(freshEntities(), (entity) => {
      if (entity.owner === playerId && entity.fortificationName) {
        playerFortifications.push(entity.fortificationName);
      }
    });

    checkUnitFortification(playerFortifications);
  }

  function checkUnitFortification(playerFortifications) {
    const unitArray = $wrapper.find('[data-single-unit]').toArray();

    unitArray.forEach(($unit) => {
      const $button = $($unit).find('button');
      const unitName = $($button).data('unit-name');
      const unitBlueprint = inject.blueprint.unit[unitName];
      const fortificationRequired = unitBlueprint.fortificationRequired;

      const isBuilded = _.indexOf(playerFortifications, fortificationRequired);

      if (isBuilded < 0) {
        $button.attr('disabled', true);
      }
    });
  }
};
