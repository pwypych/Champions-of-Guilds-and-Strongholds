// @format

'use strict';

// What does this module do?
// It listens to click_ events, for walking units, generates path through library and sends path events
g.battle.walkEmptyBlockClick = (walkie, auth, viewport, freshEntities) => {
  (function init() {
    onClick();
  })();

  function onClick() {
    walkie.onEvent(
      'click_',
      'walkEmptyBlockClick.js',
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
        findUnit(clickPosition, playerId);
      }
    });
  }

  function findUnit(clickPosition, playerId) {
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
      console.log(
        'walkEmptyBlockClick: Error: Current player not controlling the active unit'
      );
      return;
    }

    if (!unit.unitStats.current.maneuvers.walk) {
      // console.log('walkEmptyBlockClick: This unit does not walk!');
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
    if (_.isEmpty(path) || path.length < 1) {
      return;
    }

    const unit = freshEntities()[unitId];
    const movement = unit.unitStats.current.movement;

    if (path.length - 1 > movement) {
      return;
    }

    sendRequest(path, unitId);
  }

  function sendRequest(path, entityId) {
    const data = { path: path, entityId: entityId };
    $.post('/ajax/battle/movement/pathPost' + auth.uri, data, (response) => {
      console.log('walkEmptyBlockClick.js: POST pathPost', response);

      if (response && response.path) {
        const responseUnitPath = response.path;
        triggerUnitPathVerifiedByServer(entityId, responseUnitPath);
      }
    });
  }

  function triggerUnitPathVerifiedByServer(entityId, responseUnitPath) {
    walkie.triggerEvent('movementPathVerifiedByServer_', 'battleClick.js', {
      entityId: entityId,
      path: responseUnitPath
    });
  }
};
