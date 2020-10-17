// @format

'use strict';

// What does this module do?
// Renders obsticle bonus when unit gotHit or justDiedHit with melee attack
g.autoload.unitGotHitObsticleBonus = (inject) => {
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
      'recentActivityDifferanceFound_',
      'unitGotHitObsticleBonus.js',
      (data) => {
        if (
          data.entity.recentActivity.name === 'gotHit' ||
          data.entity.recentActivity.name === 'justDiedHit'
        ) {
          const obsticleCollidablesPositions =
            data.entity.recentActivity.obsticleCollidablesPositions;
          const obsticleEnemyPositions =
            data.entity.recentActivity.obsticleEnemyPositions;

          if (!obsticleCollidablesPositions && !obsticleEnemyPositions) {
            return;
          }

          console.log(
            'unitGotHitObsticleBonus: obsticlePosition:',
            data.entity.recentActivity
          );

          if (obsticleCollidablesPositions) {
            _.forEach(obsticleCollidablesPositions, (obsticlePosition) => {
              instantiateIndicator(obsticlePosition, '+30%');
            });
          }

          if (obsticleEnemyPositions) {
            _.forEach(obsticleEnemyPositions, (obsticlePosition) => {
              instantiateIndicator(obsticlePosition, '+60%');
            });
          }
        }
      },
      false
    );
  }

  function instantiateIndicator(obsticlePosition, bonusPercent) {
    const amountTextStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 13,
      fontWeight: 'bolder',
      fill: 'white',
      strokeThickness: 2
    });

    const text = new PIXI.Text(bonusPercent, amountTextStyle);
    text.name = 'obsticleBonusIndicator';
    battleContainer.addChild(text);
    text.x =
      blockWidthPx * obsticlePosition.x + blockWidthPx / 2 - text.width / 2;
    text.y =
      blockHeightPx * obsticlePosition.y + blockHeightPx / 2 - text.height / 2;

    destroyAfterTimeout(text);
  }

  function destroyAfterTimeout(text) {
    setTimeout(() => {
      text.destroy();
    }, 1000);
  }
};
