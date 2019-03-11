// @format

'use strict';

// What does this module do?
// It listens to click_ events, generates path through library and sends path events
g.battle.emptyBlockClick = (walkie, auth, viewport, freshEntities) => {
  let lastPathPositionX;
  let lastPathPositionY;

  (function init() {
    onClick();
  })();

  function onClick() {
    walkie.onEvent(
      'click_',
      'emptyBlockClick.js',
      (data) => {
        const clickPosition = data.position;
        findPlayerId(clickPosition);
      },
      false
    );
  }

  function findPlayerId(clickPosition) {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.playerCurrent) {
        const playerId = id;
        findUnitPosition(clickPosition, playerId);
      }
    });
  }

  function findUnitPosition(clickPosition, playerId) {
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

    const unitPosition = {};
    unitPosition.x = parseInt(unit.position.x, 10);
    unitPosition.y = parseInt(unit.position.y, 10);

    generatePathArray(clickPosition, unitPosition, unitId);
  }

  function generatePathArray(clickPosition, unitPosition, unitId) {
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

    const finder = new PF.AStarFinder({
      allowDiagonal: false
    });

    const pathArrayOfArrays = finder.findPath(
      unitPosition.x,
      unitPosition.y,
      clickPosition.x,
      clickPosition.y,
      grid
    );

    const path = pathArrayOfArrays.map((pathArray) => {
      return { x: pathArray[0], y: pathArray[1] };
    });

    triggerEvents(path, clickPosition, unitId);
  }

  function triggerEvents(path, clickPosition, unitId) {
    if (
      typeof lastPathPositionX !== 'undefined' &&
      typeof lastPathPositionY !== 'undefined'
    ) {
      if (
        lastPathPositionX === clickPosition.x &&
        lastPathPositionY === clickPosition.y
      ) {
        lastPathPositionX = undefined;
        lastPathPositionY = undefined;
        walkie.triggerEvent('unitPathAccepted_', 'emptyBlockClick.js', {
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
      walkie.triggerEvent('unitPathCalculated_', 'emptyBlockClick.js', {
        unitId: unitId,
        path: path
      });
    } else {
      walkie.triggerEvent('unitPathImpossible_', 'emptyBlockClick.js');
    }
  }
};
