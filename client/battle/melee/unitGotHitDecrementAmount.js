// @format

'use strict';

g.battle.unitGotHitDecrementAmount = (walkie, viewport) => {
  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onRecentActivityDifferance();
  })();

  function onRecentActivityDifferance() {
    walkie.onEvent(
      'recentActivityDifferanceFound_',
      'unitGotHitDecrementAmount.js',
      (data) => {
        if (data.entity.recentActivity.name === 'gotHit') {
          const unitId = data.entityId;
          const unit = data.entity;
          console.log('unitGotHitDecrementAmount: unitId:', unitId);
          findUnitContainer(unitId, unit);
        }
      },
      false
    );
  }

  function findUnitContainer(unitId, unit) {
    const unitContainer = battleContainer.getChildByName(unitId);

    changeUnitAmount(unitId, unit, unitContainer);
  }

  function changeUnitAmount(unitId, unit, unitContainer) {
    const pixiText = unitContainer.getChildByName('amount');
    pixiText.text = unit.amount;
  }
};
