// @format

'use strict';

// What does this module do?
// It listens to mouse click events, generates path through library and sends path events
g.battle.battleClick = (walkie, auth, viewport, freshEntities) => {
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

  function findUnitPosition(click, playerId) {
    const entities = freshEntities();

    let unit;
    let unitId;
    _.forEach(entities, (entity, id) => {
      if (
        entity.unitName &&
        entity.owner === playerId &&
        entity.position &&
        entity.active
      ) {
        unit = entity;
        unitId = id;
      }
    });

    if (!unit) {
      console.log('Error: Current player not controlling the active unit');
      return;
    }

    const unitPositon = {};
    unitPositon.x = parseInt(unit.position.x, 10);
    unitPositon.y = parseInt(unit.position.y, 10);

    generatePathArray(click, unitPositon, unitId);
  }

  function generatePathArray(click, unitPositon, unitId) {
    let battleEntity;
    _.forEach(freshEntities(), (entity) => {
      if (entity.battleStatus === 'active') {
        battleEntity = entity;
      }
    });

    if (!battleEntity) {
      return;
    }

    const width = battleEntity.battleWidth;
    const height = battleEntity.battleHeight;

    const grid = new PF.Grid(width, height);

    _.forEach(freshEntities(), (entity) => {
      if (entity.collision) {
        grid.setWalkableAt(entity.position.x, entity.position.y, false);
      }
    });

    const finder = new PF.AStarFinder({ allowDiagonal: false, weight: 2 });

    const pathArrayOfArrays = finder.findPath(
      unitPositon.x,
      unitPositon.y,
      click.x,
      click.y,
      grid
    );

    const path = pathArrayOfArrays.map((pathArray) => {
      return { x: pathArray[0], y: pathArray[1] };
    });

    triggerEvents(path, click, unitId);
  }

  function triggerEvents(path, click, unitId) {
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
          unitId: unitId,
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
      walkie.triggerEvent('pathCalculated_', 'battleClick.js', {
        unitId: unitId,
        path: path
      });
    } else {
      walkie.triggerEvent('pathImpossible_', 'battleClick.js');
    }
  }
};
