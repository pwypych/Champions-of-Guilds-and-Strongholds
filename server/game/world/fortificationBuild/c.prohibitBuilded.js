// @format

'use strict';

// What does this module do
// Disable buy buttons of fortification that cannot be build
g.autoload.prohibitBuilded = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  const $modal = $body.find('[data-world-interface-fortification-modal]');

  (function init() {
    onFortificationModalDrawn();
    onFortificationBuilded();
    onFortificationModalToggled();
  })();

  function onFortificationModalDrawn() {
    walkie.onEvent(
      'fortificationModalDrawnEvent_',
      'prohibitBuilded.js',
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
      'prohibitBuilded.js',
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
      'prohibitBuilded.js',
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

    hideButton(fortificationBuildedArray);
  }

  function hideButton(fortificationBuildedArray) {
    const buildButtonsArray = $modal.find('button').toArray();

    buildButtonsArray.forEach(($button) => {
      const fortificationName = $($button).data('fortification-name');
      const isFortificationBuilded = _.includes(
        fortificationBuildedArray,
        fortificationName
      );

      if (isFortificationBuilded) {
        $($button).hide();
        hideResources(fortificationName);
      }
    });
  }

  function hideResources(fortificationName) {
    const $buildButtons = $modal.find(
      "[data-fortification-name='" + fortificationName + "']"
    );
    const $fortificationDiv = $($buildButtons).parent();
    const $resourcesArray = $fortificationDiv.find('[data-resource]').toArray();
    $($resourcesArray).hide();
  }
};
