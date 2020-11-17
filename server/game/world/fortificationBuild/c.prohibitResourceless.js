// @format

'use strict';

// What does this module do
// Disable buy button in not enough resources to build fortification
g.autoload.prohibitResourceless = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  const $modal = $body.find('[data-world-interface-fortification-modal]');

  (function init() {
    onFortificationModalDrawn();
    onFortificationBuilded();
    onFortificationModalToggled();
    onEntitiesGet();
  })();

  function onFortificationModalDrawn() {
    walkie.onEvent(
      'fortificationModalDrawnEvent_',
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

  function onFortificationBuilded() {
    walkie.onEvent(
      'fortificationBuildedEvent_',
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

  function onFortificationModalToggled() {
    walkie.onEvent(
      'fortificationModalToggledEvent_',
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

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
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

    generateFortificationBuildedArray(playerId);
  }

  function generateFortificationBuildedArray(playerId) {
    const fortificationBuildedArray = [];
    _.forEach(freshEntities(), (entity) => {
      if (entity.fortificationName && entity.owner === playerId) {
        fortificationBuildedArray.push(entity.fortificationName);
      }
    });

    findPlayerResources(fortificationBuildedArray, playerId);
  }

  function findPlayerResources(fortificationBuildedArray, playerId) {
    const player = freshEntities()[playerId];
    const playerResources = player.playerResources;

    findNotbuildedFortifications(fortificationBuildedArray, playerResources);
  }

  function findNotbuildedFortifications(
    fortificationBuildedArray,
    playerResources
  ) {
    const fortificationArray = $modal
      .find('[data-single-fortification]')
      .toArray();

    fortificationArray.forEach(($fortification) => {
      const $button = $($fortification).find('button');
      const fortificationName = $($button).data('fortification-name');
      const isFortificationBuilded = _.includes(
        fortificationBuildedArray,
        fortificationName
      );

      if (!isFortificationBuilded) {
        checkFortificationCost($fortification, playerResources);
      }
    });
  }

  function checkFortificationCost($fortification, playerResources) {
    const $button = $($fortification).find('button');
    $button.attr('disabled', false);
    const fortificationCost = $($fortification)
      .find('[data-resource]')
      .toArray();

    fortificationCost.forEach((cost) => {
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
  }
};
