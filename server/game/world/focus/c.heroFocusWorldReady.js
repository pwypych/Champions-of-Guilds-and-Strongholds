// @format

'use strict';

g.world.heroFocusWorldReady = (walkie, viewport, freshEntities) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  (function init() {
    onEntitiesGetFirst();
  })();

  function onEntitiesGetFirst() {
    walkie.onEvent(
      'viewportWorldReady_',
      'heroFocusWorldReady.js',
      () => {
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

    const position = {};
    position.x = parseInt(hero.position.x, 10);
    position.y = parseInt(hero.position.y, 10);

    focusHeroPosition(position);
  }

  function focusHeroPosition(position) {
    const xPixel = position.x * blockWidthPx + blockWidthPx / 2;
    const yPixel = position.y * blockHeightPx + blockHeightPx / 2;

    setTimeout(() => {
      viewport.snap(xPixel, yPixel, { time: 500, removeOnComplete: true });
    });
  }
};
