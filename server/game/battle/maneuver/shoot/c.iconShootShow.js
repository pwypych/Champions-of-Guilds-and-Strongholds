// @format

'use strict';

// What does this module do?
// Checks if players active unit can shoot and shows shoot icon(s)
g.autoload.iconShootShow = (inject) => {
  const walkie = inject.walkie;
  const viewport = inject.viewport;
  const freshEntities = inject.freshEntities;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGetEvent_',
      'iconShootShow.js',
      () => {
        hideIcons();
      },
      false
    );
  }

  function hideIcons() {
    const iconShootContainer = battleContainer.getChildByName(
      'iconShootContainer'
    );

    if (!iconShootContainer) {
      return;
    }

    _.forEach(iconShootContainer.children, (icon) => {
      icon.visible = false;
    });

    findPlayerId();
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
      if (entity.unitStats && entity.active && entity.owner === playerId) {
        const unit = entity;
        checkUnitSkill(unit);
      }
    });
  }

  function checkUnitSkill(unit) {
    if (!unit.unitStats.current.maneuvers.shoot) {
      return;
    }

    findEnemies(unit);
  }

  function findEnemies(unit) {
    const enemyPositions = [];

    let isNear = false;
    _.forEach(freshEntities(), (enemy) => {
      if (enemy.unitStats) {
        if (enemy.boss !== unit.boss) {
          [
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: -1, y: 0 }
          ].forEach((offset) => {
            if (
              enemy.position.x === unit.position.x + offset.x &&
              enemy.position.y === unit.position.y + offset.y
            ) {
              // console.log('findEnemies: enemy.position:', enemy.position);
              isNear = true;
            }
          });
        }
      }
    });

    if (isNear) {
      return;
    }

    _.forEach(freshEntities(), (enemy) => {
      if (enemy.unitStats) {
        if (enemy.boss !== unit.boss) {
          enemyPositions.push(enemy.position);
        }
      }
    });

    if (!_.isEmpty(enemyPositions)) {
      _.forEach(enemyPositions, (position) => {
        showIcon(position);
      });
    }
  }

  function showIcon(position) {
    const iconShootContainer = battleContainer.getChildByName(
      'iconShootContainer'
    );

    const iconName = 'iconShoot_' + position.x + '_' + position.y;
    const icon = iconShootContainer.getChildByName(iconName);
    icon.visible = true;
  }
};
