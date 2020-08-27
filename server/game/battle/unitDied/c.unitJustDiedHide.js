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
        if (
          data.entity.recentActivity.name === 'justDiedShot' ||
          data.entity.recentActivity.name === 'justDiedHit'
        ) {
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

    waitForAnimation(unitId, unit, unitContainer);
  }

  function waitForAnimation(unitId, unit, unitContainer) {
    setTimeout(() => {
      hideFigureSprite(unitId, unit, unitContainer);
    }, 500);
  }

  function hideFigureSprite(unitId, unit, unitContainer) {
    const sprite = unitContainer.getChildByName('sprite');
    sprite.visible = false;

    const amount = unitContainer.getChildByName('amount');
    amount.visible = false;

    const marker = unitContainer.getChildByName('marker');
    marker.visible = false;
  }
};
