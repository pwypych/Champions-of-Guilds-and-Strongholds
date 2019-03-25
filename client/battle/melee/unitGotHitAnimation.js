// @format

'use strict';

g.battle.unitGotHitAnimation = (walkie, viewport) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onRecentActivityDifferance();
  })();

  function onRecentActivityDifferance() {
    walkie.onEvent(
      'recentActivityDifferanceFound_',
      'unitGotHitAnimation.js',
      (data) => {
        if (data.entity.recentActivity.name === 'gotHit') {
          const unitId = data.entityId;
          console.log('unitGotHitAnimation: unitId:', unitId);
          findUnitContainer(unitId);
        }
      },
      false
    );
  }

  function findUnitContainer(unitId) {
    const unitContainer = battleContainer.getChildByName(unitId);

    instantiateSprite(unitContainer);
  }

  function instantiateSprite(unitContainer) {
    const textureName = 'bloodSplatt';
    const texture = PIXI.loader.resources[textureName].texture;
    const sprite = new PIXI.Sprite(texture);

    sprite.name = 'bloodSplatt';
    unitContainer.addChild(sprite);

    const randomOffsetX = _.random(-10, 10);
    const randomOffsetY = _.random(-10, 10);

    sprite.x = (blockWidthPx - sprite.width) / 2 + randomOffsetX;
    sprite.y = (blockHeightPx - sprite.height) / 2 + randomOffsetY;
    destroyAfterTimeout(sprite);
  }

  function destroyAfterTimeout(sprite) {
    setTimeout(() => {
      sprite.destroy();
    }, 1000);
  }
};
