// @format

'use strict';

// What does this module do?
// Shows walk icons for active player unit that can walk
g.autoload.iconWalkShow = (inject) => {
  const viewport = inject.viewport;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'iconWalkShow.js',
      () => {
        findPlayerId();
      },
      false
    );
  }

  function findPlayerId() {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.playerCurrent) {
        const playerId = id;
        findActiveUnit(playerId);
      }
    });
  }

  function findActiveUnit(playerId) {
    _.forEach(freshEntities(), (entity) => {
      if (entity.unitStats && entity.active) {
        hideIcons();
      }

      if (entity.unitStats && entity.active && entity.owner === playerId) {
        const unit = entity;
        checkUnitMovement(unit);
      }
    });
  }

  function hideIcons() {
    const iconWalkContainer = battleContainer.getChildByName(
      'iconWalkContainer'
    );

    if (!iconWalkContainer) {
      return;
    }

    _.forEach(iconWalkContainer.children, (icon) => {
      icon.visible = false;
    });
  }

  function checkUnitMovement(unit) {
    if (!unit.unitStats.current.maneuvers.walk) {
      // console.log('iconWalkShow: This unit does not walk!');
      return;
    }

    const movement = unit.unitStats.current.movement;
    const unitPosition = unit.position;
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
    const iconWalkContainer = battleContainer.getChildByName(
      'iconWalkContainer'
    );

    // happens when there are no units on battlefield
    if (!iconWalkContainer) {
      return;
    }

    const iconName = 'iconWalk_' + position.x + '_' + position.y;
    const icon = iconWalkContainer.getChildByName(iconName);
    icon.visible = true;
  }
};
