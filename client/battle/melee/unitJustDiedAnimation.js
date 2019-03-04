// @format

'use strict';

g.battle.unitJustDiedAnimation = (walkie, viewport) => {
  // const blockWidthPx = 32;
  // const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onRecentActivityDifferance();
  })();

  function onRecentActivityDifferance() {
    walkie.onEvent(
      'recentActivityDifferanceFound_',
      'unitJustDiedAnimation.js',
      (data) => {
        if (data.entity.recentActivity.name === 'justDied') {
          const unitId = data.entityId;
          const unit = data.entity;
          console.log('unitJustDiedAnimation: unitId:', unitId);
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
    const textureName = 'skeleton';
    const texture = PIXI.loader.resources[textureName].texture;
    const sprite = new PIXI.Sprite(texture);

    sprite.name = 'bloodSplatt';
    unitContainer.addChild(sprite);
    //
    // const randomX = _.random(-10, 10);
    // const randomY = _.random(-10, 10);
    //
    // sprite.x = (blockWidthPx - sprite.width) / 2 + randomX;
    // sprite.y = (blockHeightPx - sprite.height) / 2 + randomY;

    destroyAfterTimeout(sprite);
  }

  function destroyAfterTimeout(sprite) {
    setTimeout(() => {
      sprite.destroy();
    }, 1000);
  }
};
