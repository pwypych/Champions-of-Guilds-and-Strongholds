// @format

'use strict';

// What does this module do?
// Adds indicators (Miss, Low etc.) after unit recieves damage in battle
g.autoload.unitDamageGradeBonus = (inject) => {
  const viewport = inject.viewport;
  const walkie = inject.walkie;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onRecentActivityDifferance();
  })();

  function onRecentActivityDifferance() {
    walkie.onEvent(
      'recentActivityDifferanceFoundEvent_',
      'unitDamageGradeBonus.js',
      (data) => {
        if (data.entity.recentActivity.damageGrade) {
          const damageGrade = data.entity.recentActivity.damageGrade;
          const unitPosition = data.entity.position;

          console.log('unitDamageGradeBonus: damageGrade:', damageGrade);

          instantiateIndicator(unitPosition, damageGrade);
        }
      },
      false
    );
  }

  function instantiateIndicator(unitPosition, damageGrade) {
    const amountTextStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 13,
      fontWeight: 'bolder',
      fill: 'white',
      strokeThickness: 2
    });

    const text = new PIXI.Text(damageGrade, amountTextStyle);
    text.name = 'damageGradeIndicator';
    battleContainer.addChild(text);
    text.x = blockWidthPx * unitPosition.x + blockWidthPx / 2 - text.width / 2;
    text.y =
      blockHeightPx * unitPosition.y + blockHeightPx / 2 - text.height / 2;

    destroyAfterTimeout(text);
  }

  function destroyAfterTimeout(text) {
    setTimeout(() => {
      text.destroy();
    }, 1000);
  }
};
