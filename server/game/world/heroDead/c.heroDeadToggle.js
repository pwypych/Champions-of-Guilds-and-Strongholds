// @format

'use strict';

g.autoload.heroDeadToggle = (inject) => {
  const $body = inject.$body;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  const $heroDead = $body.find('[data-hero-dead]');

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
    if (hero.dead) {
      $heroDead.show();
    }
  }
};
