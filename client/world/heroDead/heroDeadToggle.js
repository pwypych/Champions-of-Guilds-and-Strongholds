// @format

'use strict';

g.world.heroDeadToggle = ($body, walkie, freshEntities) => {
  const $heroDead = $body.find('.js-hero-dead');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'heroDeadToggle.js',
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

    findHeroPosition(playerId);
  }

  function findHeroPosition(playerId) {
    let hero;
    _.forEach(freshEntities(), (entity) => {
      if (entity.heroStats && entity.owner === playerId && entity.position) {
        hero = entity;
      }
    });

    // when hero is dead
    if (!hero) {
      console.log('hero is dead', $heroDead);
      $heroDead.show();
    }
  }
};
