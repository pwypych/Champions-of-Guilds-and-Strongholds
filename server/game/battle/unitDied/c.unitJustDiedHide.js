// @format

'use strict';

// What does this module do?
// Hides unit and its amount and marker, after unit justDiedHit or justDiedShot
g.autoload.unitJustDiedHide = (inject) => {
  const viewport = inject.viewport;
  const walkie = inject.walkie;

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
      hideUnitSprite(unitId, unit, unitContainer);
    }, 500);
  }

  function hideUnitSprite(unitId, unit, unitContainer) {
    const sprite = unitContainer.getChildByName('sprite');
    if (sprite) {
      sprite.visible = false;
    }

    const amount = unitContainer.getChildByName('amount');
    if (amount) {
      amount.visible = false;
    }

    const marker = unitContainer.getChildByName('marker');
    if (marker) {
      marker.visible = false;
    }
  }
};
