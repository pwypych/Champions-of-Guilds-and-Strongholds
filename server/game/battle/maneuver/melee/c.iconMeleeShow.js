// @format

'use strict';

// What does this module do?
// Checks if players active unit is next to enemy(ies) and shows melee icon(s)
g.autoload.iconMeleeShow = (inject) => {
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
      'iconMelee.js',
      () => {
        hideIcons();
      },
      false
    );
  }

  function hideIcons() {
    const iconMeleeContainer = battleContainer.getChildByName(
      'iconMeleeContainer'
    );

    if (!iconMeleeContainer) {
      return;
    }

    _.forEach(iconMeleeContainer.children, (icon) => {
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
        findEnemies(unit);
      }
    });
  }

  function findEnemies(unit) {
    const enemyPositions = [];
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

              enemyPositions.push(enemy.position);
            }
          });
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
    const iconMeleeContainer = battleContainer.getChildByName(
      'iconMeleeContainer'
    );

    const iconName = 'iconMelee_' + position.x + '_' + position.y;
    const icon = iconMeleeContainer.getChildByName(iconName);
    icon.visible = true;
  }
};
