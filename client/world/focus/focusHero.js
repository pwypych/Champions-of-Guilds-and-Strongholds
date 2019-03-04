// @format

'use strict';

g.world.focusHero = (walkie, viewport, freshEntities) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  let wasAllreadyFocused;

  (function init() {
    onStateChange();
    onEntitiesGet();
  })();

  function onStateChange() {
    walkie.onEvent(
      'stateChange_',
      'worldInterfaceToggle.js',
      (state) => {
        if (state === 'worldState') {
          wasAllreadyFocused = false;
        }
      },
      false
    );
  }

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'focusHero.js',
      (entities) => {
        const gameEntity = entities[entities._id];

        if (gameEntity.state !== 'worldState') {
          return;
        }

        if (wasAllreadyFocused) {
          return;
        }

        wasAllreadyFocused = true;

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
      if (
        entity.figureName === 'heroHuman' &&
        entity.owner === playerId &&
        entity.position
      ) {
        hero = entity;
      }
    });

    const position = {};
    position.x = parseInt(hero.position.x, 10);
    position.y = parseInt(hero.position.y, 10);

    focusHeroPosition(position);
  }

  function focusHeroPosition(position) {
    const xPixel = position.x * blockWidthPx + $(window).width() / 4 + 16;
    const yPixel = position.y * blockHeightPx + $(window).height() / 4 + 16;

    console.log('focusHero: focusHeroPosition()', position, xPixel, yPixel);
    viewport.snap(xPixel, yPixel, { time: 500, removeOnComplete: true });
  }
};
