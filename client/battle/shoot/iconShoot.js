// @format

'use strict';

g.battle.iconShoot = (walkie, viewport, freshEntities) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'iconShoot.js',
      () => {
        drawIconsOnce();
      },
      false
    );
  }

  function drawIconsOnce() {
    let iconShootContainer = battleContainer.getChildByName(
      'iconShootContainer'
    );

    if (!iconShootContainer) {
      iconShootContainer = new PIXI.Container();
      iconShootContainer.name = 'iconShootContainer';
      battleContainer.addChildZ(iconShootContainer, 10000);
    }

    let battleWidth;
    let battleHeight;

    if (iconShootContainer.children.length < 1) {
      _.forEach(freshEntities(), (entity) => {
        if (entity.battleStatus === 'active') {
          battleWidth = entity.battleWidth;
          battleHeight = entity.battleHeight;
        }
      });

      _.times(battleWidth, (x) => {
        _.times(battleHeight, (y) => {
          const iconName = 'iconShoot_' + x + '_' + y;

          const textureName = 'iconShoot';
          const texture = PIXI.loader.resources[textureName].texture;
          const icon = new PIXI.Sprite(texture);
          icon.name = iconName;
          iconShootContainer.addChild(icon);

          icon.x = x * blockWidthPx;
          icon.y = y * blockHeightPx;
          icon.alpha = 0.6;
        });
      });
    }

    hideIcons();
  }

  function hideIcons() {
    const iconShootContainer = battleContainer.getChildByName(
      'iconShootContainer'
    );

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
        findEnemies(unit);
      }
    });
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
