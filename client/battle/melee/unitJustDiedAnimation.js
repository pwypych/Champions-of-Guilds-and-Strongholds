// @format

'use strict';

g.battle.unitJustDiedAnimation = (walkie, viewport) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

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

    instantiateAnimation(unit, unitContainer);
  }

  function instantiateAnimation(unit, unitContainer) {
    const textureName = 'bloodSplatt';
    const texture = PIXI.loader.resources[textureName].texture;
    const indicator = new PIXI.Sprite(texture);

    indicator.name = 'bloodSplatt';
    unitContainer.addChild(indicator);

    const randomX = _.random(-10, 10);
    const randomY = _.random(-10, 10);

    indicator.x = (blockWidthPx - indicator.width) / 2 + randomX;
    indicator.y = (blockHeightPx - indicator.height) / 2 + randomY;

    destroyAfterTimeout(indicator);
  }

  function destroyAfterTimeout(indicator) {
    setTimeout(() => {
      indicator.destroy();
    }, 1000);
  }
};
