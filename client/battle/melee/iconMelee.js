// @format

'use strict';

g.battle.iconMelee = (walkie, viewport, freshEntities) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'iconMelee.js',
      () => {
        drawIconsOnce();
      },
      false
    );
  }

  function drawIconsOnce() {
    let iconMeleeContainer = battleContainer.getChildByName(
      'iconMeleeContainer'
    );

    if (!iconMeleeContainer) {
      iconMeleeContainer = new PIXI.Container();
      iconMeleeContainer.name = 'iconMeleeContainer';
      battleContainer.addChildZ(iconMeleeContainer, 10000);
    }

    let battleWidth;
    let battleHeight;

    if (iconMeleeContainer.children.length < 1) {
      _.forEach(freshEntities(), (entity) => {
        if (entity.battleStatus === 'active') {
          battleWidth = entity.battleWidth;
          battleHeight = entity.battleHeight;
        }
      });

      _.times(battleWidth, (x) => {
        _.times(battleHeight, (y) => {
          const iconName = 'iconMelee_' + x + '_' + y;

          const textureName = 'iconMelee';
          const texture = PIXI.loader.resources[textureName].texture;
          const icon = new PIXI.Sprite(texture);
          icon.name = iconName;
          iconMeleeContainer.addChild(icon);

          icon.x = x * blockWidthPx;
          icon.y = y * blockHeightPx;
          icon.alpha = 0.6;
        });
      });
    }

    hideIcons();
  }

  function hideIcons() {
    const iconMeleeContainer = battleContainer.getChildByName(
      'iconMeleeContainer'
    );

    _.forEach(iconMeleeContainer.children, (icon) => {
      icon.visible = false;
    });

    findPlayerCurrent();
  }

  function findPlayerCurrent() {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.playerCurrent) {
        const playerId = id;
        forEachActiveUnit(playerId);
      }
    });
  }

  function forEachActiveUnit(playerId) {
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
