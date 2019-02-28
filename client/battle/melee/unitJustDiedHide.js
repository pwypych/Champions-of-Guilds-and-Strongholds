// @format

'use strict';

g.battle.unitJustDiedHide = (walkie, viewport) => {
  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onRecentActivityDifferance();
  })();

  function onRecentActivityDifferance() {
    walkie.onEvent(
      'recentActivityDifferanceFound_',
      'unitJustDiedHide.js',
      (data) => {
        if (data.entity.recentActivity.name === 'justDied') {
          const unitId = data.entityId;
          const unit = data.entity;
          console.log('unitJustDiedHide: unitId:', unitId);
          findUnitContainer(unitId, unit);
        }
      },
      false
    );
  }

  function findUnitContainer(unitId, unit) {
    const unitContainer = battleContainer.getChildByName(unitId);

    hideFigureSprite(unitId, unit, unitContainer);
  }

  function hideFigureSprite(unitId, unit, unitContainer) {
    const sprite = unitContainer.getChildByName('sprite');
    sprite.visible = false;

    const amount = unitContainer.getChildByName('amount');
    amount.visible = false;

    instantiateIndicator(unit, unitContainer);
  }

  function instantiateIndicator(unit, unitContainer) {
    const textureName = 'bloodSplatt';
    const texture = PIXI.loader.resources[textureName].texture;
    const indicator = new PIXI.Sprite(texture);
    indicator.name = 'bloodSplatt';
    unitContainer.addChild(indicator);

    console.log('!!!!!! indicator.width:', indicator.width);
    console.log('!!!!!! indicator.height:', indicator.height);

    indicator.x = 5;
    indicator.y = 5;

    destroyAfterTimeout(indicator);
  }

  function destroyAfterTimeout(indicator) {
    setTimeout(() => {
      indicator.destroy();
    }, 1000);
  }
};
