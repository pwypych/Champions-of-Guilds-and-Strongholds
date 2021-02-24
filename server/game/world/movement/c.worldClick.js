// @format

'use strict';

// What does this module do?
// It listens to mouse click events, generates path through library and sends path events
g.autoload.worldClick = (inject) => {
  const viewport = inject.viewport;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  let lastPathPositionX;
  let lastPathPositionY;

  (function init() {
    addListener();
  })();

  function addListener() {
    viewport.on('clicked', (event) => {
      const gameEntity = freshEntities()[freshEntities()._id];
      if (gameEntity.state !== 'worldState') {
        return;
      }

      calculateClickedTile(event);
    });
  }

  function calculateClickedTile(event) {
    const click = {};
    click.x = Math.floor(event.world.x / 32);
    click.y = Math.floor(event.world.y / 32);

    findPlayerId(click);
  }

  function findPlayerId(click) {
    let playerId;
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.playerCurrent) {
        playerId = id;
      }
    });

    findHeroPosition(click, playerId);
  }

  function findHeroPosition(click, playerId) {
    let hero;
    let heroId;
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.heroStats && entity.owner === playerId && entity.position) {
        hero = entity;
        heroId = id;
      }
    });

    const heroPositon = {};
    heroPositon.x = parseInt(hero.position.x, 10);
    heroPositon.y = parseInt(hero.position.y, 10);

    generatePathArray(click, heroPositon, heroId);
  }

  function generatePathArray(click, heroPositon, heroId) {
    const gameEntity = freshEntities()[freshEntities()._id];
    const width = gameEntity.mapData.width;
    const height = gameEntity.mapData.height;

    const grid = new PF.Grid(width, height);

    _.forEach(freshEntities(), (entity) => {
      if (entity.figureName && entity.collision) {
        grid.setWalkableAt(entity.position.x, entity.position.y, false);
      }
    });

    const finder = new PF.AStarFinder({ allowDiagonal: false, weight: 2 });

    const pathArrayOfArrays = finder.findPath(
      heroPositon.x,
      heroPositon.y,
      click.x,
      click.y,
      grid
    );

    const path = pathArrayOfArrays.map((pathArray) => {
      return { x: pathArray[0], y: pathArray[1] };
    });

    triggerEvents(path, click, heroId);
  }

  function triggerEvents(path, click, heroId) {
    console.log('lastPathPositionX', lastPathPositionX);
    console.log('lastPathPositionY', lastPathPositionY);
    console.log('click', click);

    if (
      typeof lastPathPositionX !== 'undefined' &&
      typeof lastPathPositionY !== 'undefined'
    ) {
      if (lastPathPositionX === click.x && lastPathPositionY === click.y) {
        lastPathPositionX = undefined;
        lastPathPositionY = undefined;
        walkie.triggerEvent('heroPathAcceptedEvent_', 'worldClick.js', {
          heroId: heroId,
          path: path
        });
        return;
      }
    }

    if (!_.isEmpty(path) && path.length > 1) {
      lastPathPositionX = path[path.length - 1].x;
      lastPathPositionY = path[path.length - 1].y;
    } else {
      lastPathPositionX = undefined;
      lastPathPositionY = undefined;
    }

    if (!_.isEmpty(path) && path.length > 1) {
      walkie.triggerEvent('heroPathCalculatedEvent_', 'worldClick.js', {
        heroId: heroId,
        path: path
      });
    } else {
      walkie.triggerEvent('heroPathImpossibleEvent_', 'worldClick.js');
    }
  }
};
