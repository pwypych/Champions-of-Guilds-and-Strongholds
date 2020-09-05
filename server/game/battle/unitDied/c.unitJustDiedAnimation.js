// @format

'use strict';

g.autoload.unitJustDiedAnimation = (inject) => {
  const viewport = inject.viewport;
  const walkie = inject.walkie;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onRecentActivityDifferance();
  })();

  function onRecentActivityDifferance() {
    walkie.onEvent(
      'recentActivityDifferanceFound_',
      'unitJustDiedAnimation.js',
      (data) => {
        if (
          data.entity.recentActivity.name === 'justDiedShot' ||
          data.entity.recentActivity.name === 'justDiedHit'
        ) {
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

    waitForAnimation(unit, unitContainer);
  }

  function waitForAnimation(unit, unitContainer) {
    setTimeout(() => {
      instantiateSprite(unit, unitContainer);
    }, 500);
  }

  function instantiateSprite(unit, unitContainer) {
    const textureName = 'grave';
    const texture = PIXI.loader.resources[textureName].texture;
    const sprite = new PIXI.Sprite(texture);

    sprite.name = 'grave';
    unitContainer.addChild(sprite);

    destroyAfterTimeout(sprite);
  }

  function destroyAfterTimeout(sprite) {
    setTimeout(() => {
      sprite.destroy();
    }, 1500);
  }
};
