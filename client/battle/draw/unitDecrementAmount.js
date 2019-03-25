// @format

'use strict';

g.battle.unitDecrementAmount = (walkie, viewport) => {
  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onRecentActivityDifferance();
  })();

  function onRecentActivityDifferance() {
    walkie.onEvent(
      'recentActivityDifferanceFound_',
      'unitDecrementAmount.js',
      (data) => {
        if (
          data.entity.recentActivity.name === 'gotHit' ||
          data.entity.recentActivity.name === 'gotShot'
        ) {
          const unitId = data.entityId;
          const unit = data.entity;
          console.log('unitDecrementAmount: unitId:', unitId);
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
