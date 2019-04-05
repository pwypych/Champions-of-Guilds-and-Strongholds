// @format

'use strict';

g.world.heroNearBattleAnimation = (walkie, viewport, freshEntities) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const worldContainer = viewport.getChildByName('worldContainer');

  (function init() {
    onRecentActivityDifferance();
  })();

  function onRecentActivityDifferance() {
    walkie.onEvent(
      'recentActivityDifferanceFound_',
      'heroNearBattleAnimation.js',
      (data) => {
        if (data.entity.recentActivity.name === 'onMovement') {
          const pathLength = data.entity.recentActivity.path.length;
          const position = data.entity.recentActivity.path[pathLength - 1];
          // console.log('heroNearBattleAnimation: position:', position);
          checkIsPositionBattle(position, pathLength);
        }
      },
      false
    );
  }

  function checkIsPositionBattle(position, pathLength) {
    const offsets = [];

    _.forEach(freshEntities(), (entity) => {
      if (entity.unitAmounts && !entity.heroStats) {
        [
          { x: 0, y: -1 },
          { x: 1, y: 0 },
          { x: 0, y: 1 },
          { x: -1, y: 0 }
        ].forEach((offset) => {
          if (
            entity.position.x === position.x + offset.x &&
            entity.position.y === position.y + offset.y
          ) {
            offsets.push(offset);
          }
        });
      }
    });

    if (_.isEmpty(offsets)) {
      return;
    }

    waitForEndOfPath(pathLength, position, offsets);
  }

  function waitForEndOfPath(pathLength, position, offsets) {
    const time = Math.round(0.15 * (pathLength - 1) * 1000);
    setTimeout(() => {
      forEachOffset(position, offsets);
    }, time);
  }

  function forEachOffset(position, offsets) {
    _.forEach(offsets, (offset) => {
      instantiateSprite(position, offset);
    });
  }

  function instantiateSprite(position, offset) {
    const textureName = 'battleCrossedSwords';
    const texture = PIXI.loader.resources[textureName].texture;
    const sprite = new PIXI.Sprite(texture);

    sprite.name = 'battleCrossedSwords';
    worldContainer.addChildZ(sprite, 1000);

    sprite.x = position.x * blockWidthPx + (offset.x * blockWidthPx) / 1.7;
    sprite.y = position.y * blockWidthPx + (offset.y * blockHeightPx) / 1.7;
    destroyAfterTimeout(sprite);
  }

  function destroyAfterTimeout(sprite) {
    setTimeout(() => {
      worldContainer.removeChild(sprite);
      sprite.destroy();
    }, 1000);
  }
};
