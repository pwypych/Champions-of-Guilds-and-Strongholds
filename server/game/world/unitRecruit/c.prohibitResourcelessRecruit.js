// @format

'use strict';

// What does this module do
// Disable recruit button if not enough resources to recruit unit
g.autoload.prohibitResourcelessRecruit = (inject) => {
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

    findPlayerResources(playerId);
  }

  function findPlayerResources(playerId) {
    const player = freshEntities()[playerId];
    const playerResources = player.playerResources;

    checkUnitCost(playerResources);
  }

  function checkUnitCost(playerResources) {
    const unitArray = $wrapper.find('[data-single-unit]').toArray();

    unitArray.forEach(($unit) => {
      const $button = $($unit).find('button');
      const unitCost = $($unit)
        .find('[data-resource]')
        .toArray();

      unitCost.forEach((cost) => {
        const resource = $(cost).data('resource');
        const resourceAmount = $(cost)
          .find('span')
          .text();
        const $spanAmount = $(cost).find('span');
        $spanAmount.css({ color: '#fff' });

        if (resourceAmount > playerResources[resource]) {
          $spanAmount.css({ color: '#f00' });
          $button.attr('disabled', true);
        }
      });
    });
  }
};
