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
    const width = battleEntity.battleWidth;
    const height = battleEntity.battleHeight;

    const grid = new PF.Grid(width, height);

    _.forEach(freshEntities(), (entity) => {
      if (entity.collision) {
        grid.setWalkableAt(entity.position.x, entity.position.y, false);
      }
    });

    const finder = new PF.BiAStarFinder();

    const pathArrayOfArrays = finder.findPath(
      unitPositon.x,
      unitPositon.y,
      click.x,
      click.y,
      grid
    );

    const pathArray = pathArrayOfArrays.map((path) => {
      return { x: path[0], y: path[1] };
    });

    triggerEvents(pathArray, click, unitId);
  }

  function triggerEvents(pathArray, click, unitId) {
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
        walkie.triggerEvent('unitPathAccepted_', 'battleClick.js', {
          unitId: unitId,
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
      walkie.triggerEvent('unitPathCalculated_', 'battleClick.js', {
        unitId: unitId,
        pathArray: pathArray
      });
    } else {
      walkie.triggerEvent('unitPathImpossible_', 'battleClick.js');
    }
  }
};
