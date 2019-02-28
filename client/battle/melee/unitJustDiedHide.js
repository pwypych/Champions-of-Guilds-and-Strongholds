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
  }
};
