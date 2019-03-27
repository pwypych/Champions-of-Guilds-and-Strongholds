// @format

'use strict';

g.battle.iconMovement = (walkie, viewport, freshEntities) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'iconMovement.js',
      () => {
        drawIconsOnce();
      },
      false
    );
  }

  function drawIconsOnce() {
    let iconMovementContainer = battleContainer.getChildByName(
      'iconMovementContainer'
    );

    if (!iconMovementContainer) {
      iconMovementContainer = new PIXI.Container();
      iconMovementContainer.name = 'iconMovementContainer';
      battleContainer.addChildZ(iconMovementContainer, 3);
    }

    let battleWidth;
    let battleHeight;

    if (iconMovementContainer.children.length < 1) {
      _.forEach(freshEntities(), (entity) => {
        if (entity.battleStatus === 'active') {
          battleWidth = entity.battleWidth;
          battleHeight = entity.battleHeight;
        }
      });

      _.times(battleWidth, (x) => {
        _.times(battleHeight, (y) => {
          const iconName = 'iconMovement_' + x + '_' + y;

          const textureName = 'iconMovement';
          const texture = PIXI.loader.resources[textureName].texture;
          const icon = new PIXI.Sprite(texture);
          icon.name = iconName;
          iconMovementContainer.addChild(icon);

          icon.x = x * blockWidthPx;
          icon.y = y * blockHeightPx;
          icon.alpha = 0.2;
        });
      });
    }

    hideIcons();
  }

  function hideIcons() {
    const iconMovementContainer = battleContainer.getChildByName(
      'iconMovementContainer'
    );

    _.forEach(iconMovementContainer.children, (icon) => {
      icon.visible = false;
    });

    findActiveUnit();
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
    const movement = unit.unitStats.current.movement;
    const position = unit.position;
    toolGenerateGrid(position, movement);
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

    let positions = [];
    positions.push({ x: x, y: y });

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
            positionPossibleArray.push(check);
          }
        });

        _.forEach(positionPossibleArray, (positionPossible) => {
          positions.push(positionPossible);
        });
      });
    });

    positions = _.uniq(positions);

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
