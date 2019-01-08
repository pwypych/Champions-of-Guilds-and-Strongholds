// @format

'use strict';

// What does this module do?
// It listens to mouse click events, generates path through library and sends path events
g.world.battleClick = (walkie, auth, viewport, freshEntities) => {
  let lastPathPositionX;
  let lastPathPositionY;

  (function init() {
    addListener();
  })();

  function addListener() {
    viewport.on('clicked', (event) => {
      const gameEntity = freshEntities()[freshEntities()._id];
      if (gameEntity.state !== 'battleState') {
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
    const entities = freshEntities();

    let playerId;
    _.forEach(entities, (entity, id) => {
      if (entity.playerCurrent) {
        playerId = id;
      }
    });

    findUnitPosition(click, playerId);
  }

  // must have current unit selected in battle entity
  function findUnitPosition(click, playerId) {
    const entities = freshEntities();

    let hero;
    let heroId;
    _.forEach(entities, (entity, id) => {
      if (
        entity.figure === 'heroHuman' &&
        entity.owner === playerId &&
        entity.position
      ) {
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
      if (entity.collision) {
        grid.setWalkableAt(entity.position.x, entity.position.y, false);
      }
    });

    const finder = new PF.AStarFinder({ allowDiagonal: true });

    const pathArrayOfArrays = finder.findPath(
      heroPositon.x,
      heroPositon.y,
      click.x,
      click.y,
      grid
    );

    const pathArray = pathArrayOfArrays.map((path) => {
      return { x: path[0], y: path[1] };
    });

    triggerEvents(pathArray, click, heroId);
  }

  function triggerEvents(pathArray, click, heroId) {
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
        walkie.triggerEvent('pathAccepted_', 'battleClick.js', {
          heroId: heroId,
          pathArray: pathArray
        });
        return;
      }
    }

    if (!_.isEmpty(pathArray) && pathArray.length > 1) {
      lastPathPositionX = pathArray[pathArray.length - 1].x;
      lastPathPositionY = pathArray[pathArray.length - 1].y;
    } else {
      lastPathPositionX = undefined;
      lastPathPositionY = undefined;
    }

    if (!_.isEmpty(pathArray) && pathArray.length > 1) {
      walkie.triggerEvent('pathCalculated_', 'battleClick.js', {
        heroId: heroId,
        pathArray: pathArray
      });
    } else {
      walkie.triggerEvent('pathImpossible_', 'battleClick.js');
    }
  }
};
