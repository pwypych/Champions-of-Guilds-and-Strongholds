// @format

'use strict';

// What does this module do?
// Shows fly icons for active player unit that can fly
g.autoload.iconFlyShow = (inject) => {
  const viewport = inject.viewport;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGetEvent_',
      'iconFlyShow.js',
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
    const iconFlyContainer = battleContainer.getChildByName('iconFlyContainer');

    if (!iconFlyContainer) {
      return;
    }

    _.forEach(iconFlyContainer.children, (icon) => {
      icon.visible = false;
    });
  }

  function checkUnitMovement(unit) {
    if (!unit.unitStats.current.maneuvers.fly) {
      // console.log('iconFlyShow: This unit does not fly!');
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

    const x = unitPosition.x;
    const y = unitPosition.y;

    let positions = [];
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

    _.forEach(freshEntities(), (entity) => {
      if (entity.collision) {
        positions = _.filter(positions, (position) => {
          if (
            position.x === entity.position.x &&
            position.y === entity.position.y
          ) {
            return false;
          }
          return true;
        });
      }
    });

    forEachPossiblePosition(positions);
  }

  function forEachPossiblePosition(positionPossibleArray) {
    _.forEach(positionPossibleArray, (position) => {
      showIcon(position);
    });
  }

  function showIcon(position) {
    const iconFlyContainer = battleContainer.getChildByName('iconFlyContainer');

    // happens when there are no units on battlefield
    if (!iconFlyContainer) {
      return;
    }

    const iconName = 'iconFly_' + position.x + '_' + position.y;
    const icon = iconFlyContainer.getChildByName(iconName);
    icon.visible = true;
  }
};
