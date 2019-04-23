// @format

'use strict';

g.battle.walkIconShow = (walkie, viewport, freshEntities) => {
  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'walkIconShow.js',
      () => {
        findActiveUnit();
      },
      false
    );
  }

  function findActiveUnit() {
    _.forEach(freshEntities(), (entity) => {
      if (entity.unitStats && entity.active) {
        const unit = entity;
        checkUnitMovement(unit);
      }
    });
  }

  function checkUnitMovement(unit) {
    if (!unit.unitStats.current.maneuvers.walk) {
      // console.log('walkIconShow: This unit does not walk!');
      return;
    }

    const movement = unit.unitStats.current.movement;
    const unitPosition = unit.position;
    hideIcons(unitPosition, movement);
  }

  function hideIcons(unitPosition, movement) {
    const iconMovementContainer = battleContainer.getChildByName(
      'iconMovementContainer'
    );

    if (!iconMovementContainer) {
      return;
    }

    _.forEach(iconMovementContainer.children, (icon) => {
      icon.visible = false;
    });

    toolGenerateGrid(unitPosition, movement);
  }

  function toolGenerateGrid(unitPosition, movement) {
    let battleWidth;
    let battleHeight;

    _.forEach(freshEntities(), (entity) => {
      if (entity.battleStatus === 'active') {
        battleWidth = entity.battleWidth;
        battleHeight = entity.battleHeight;
      }
    });

    const grid = [];
    _.times(battleHeight, (y) => {
      grid[y] = [];
      _.times(battleWidth, (x) => {
        grid[y][x] = true;
      });
    });

    _.forEach(freshEntities(), (entity) => {
      if (entity.collision) {
        grid[entity.position.y][entity.position.x] = false;
      }
    });

    const x = unitPosition.x;
    const y = unitPosition.y;

    const positions = [];
    positions.push({ x: x, y: y });

    const checkUsed = {};

    _.times(movement, () => {
      _.forEach(positions, (position) => {
        const positionPossibleArray = [];
        [
          { x: 0, y: -1 },
          { x: 1, y: 0 },
          { x: 0, y: 1 },
          { x: -1, y: 0 }
        ].forEach((offset) => {
          const check = {};
          check.x = position.x - offset.x;
          check.y = position.y - offset.y;

          if (grid[check.y] && grid[check.y][check.x]) {
            const name = check.y + '_' + check.x;
            if (!checkUsed[name]) {
              positionPossibleArray.push(check);
              checkUsed[name] = true;
            }
          }
        });

        _.forEach(positionPossibleArray, (positionPossible) => {
          positions.push(positionPossible);
        });
      });
    });

    forEachPossiblePosition(positions);
  }

  function forEachPossiblePosition(positionPossibleArray) {
    _.forEach(positionPossibleArray, (position) => {
      showIcon(position);
    });
  }

  function showIcon(position) {
    const iconMovementContainer = battleContainer.getChildByName(
      'iconMovementContainer'
    );

    const iconName = 'iconMovement_' + position.x + '_' + position.y;
    const icon = iconMovementContainer.getChildByName(iconName);
    icon.visible = true;
  }
};
