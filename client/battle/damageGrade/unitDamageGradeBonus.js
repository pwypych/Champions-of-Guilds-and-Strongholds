// @format

'use strict';

g.battle.unitDamageGradeBonus = (walkie, viewport) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    // adds miss! low! mid! high! crit! indicators to battle
    onRecentActivityDifferance();
  })();

  function onRecentActivityDifferance() {
    walkie.onEvent(
      'recentActivityDifferanceFound_',
      'unitDamageGradeBonus.js',
      (data) => {
        if (data.entity.recentActivity.damageGrade) {
          const damageGrade = data.entity.recentActivity.damageGrade;
          const unitPosition = data.entity.position;

          console.log('unitDamageGradeBonus: damageGrade:', damageGrade);

          waitForAnimation(unitPosition, damageGrade);
        }
      },
      false
    );
  }

  function waitForAnimation(unitPosition, damageGrade) {
    setTimeout(() => {
      instantiateIndicator(unitPosition, damageGrade);
    }, 500);
  }

  function instantiateIndicator(unitPosition, damageGrade) {
    const amountTextStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 12,
      fontWeight: 'bolder',
      fill: 'white',
      strokeThickness: 2
    });

    const text = new PIXI.Text(damageGrade + '!', amountTextStyle);
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
