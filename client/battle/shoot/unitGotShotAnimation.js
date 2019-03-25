// @format

'use strict';

g.battle.unitGotShotAnimation = (walkie, viewport) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onRecentActivityDifferance();
  })();

  function onRecentActivityDifferance() {
    walkie.onEvent(
      'recentActivityDifferanceFound_',
      'unitGotShotAnimation.js',
      (data) => {
        if (data.entity.recentActivity.name === 'gotShot') {
          const unitId = data.entityId;
          const unit = data.entity;
          console.log('unitGotShotAnimation: unitId:', unitId);
          findUnitContainer(unitId, unit);
        }
      },
      false
    );
  }

  function findUnitContainer(unitId, unit) {
    const unitContainer = battleContainer.getChildByName(unitId);

    instantiateSprite(unit, unitContainer);
  }

  function instantiateSprite(unit, unitContainer) {
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
