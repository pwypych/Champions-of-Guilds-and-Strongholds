// @format

'use strict';

// What does this module do
// Disable units buy button when hero not in castle
g.autoload.prohibitOutsideCastle = (inject) => {
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

    findHero(playerId);
  }

  function findHero(playerId) {
    _.forEach(freshEntities(), (entity) => {
      if (entity.owner === playerId && entity.heroStats) {
        const hero = entity;
        findCastle(playerId, hero);
      }
    });
  }

  function findCastle(playerId, hero) {
    _.forEach(freshEntities(), (entity) => {
      if (entity.owner === playerId && entity.visitableType === 'castle') {
        const castle = entity;
        compareHeroCastlePosition(castle, hero);
      }
    });
  }

  function compareHeroCastlePosition(castle, hero) {
    if (
      castle.position.x !== hero.position.x ||
      castle.position.y !== hero.position.y
    ) {
      disableRecruitUnitButton();
      return;
    }

    enableRecruitUnitButton();
  }

  function disableRecruitUnitButton() {
    const recruitButtonsArray = $wrapper.find('button').toArray();

    recruitButtonsArray.forEach(($button) => {
      $($button).attr('disabled', true);
    });
  }

  function enableRecruitUnitButton() {
    const recruitButtonsArray = $wrapper.find('button').toArray();

    recruitButtonsArray.forEach(($button) => {
      $($button).attr('disabled', false);
    });
  }
};
