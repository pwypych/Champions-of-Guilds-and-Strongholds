// @format

'use strict';

// What does this module do?
// Renders negative obsticle bonus when unit gotGotShot or justDiedShot with shoot attack
g.autoload.unitGotShotObsticleBonus = (inject) => {
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
      'unitGotShotObsticleBonus.js',
      (data) => {
        if (
          data.entity.recentActivity.name === 'gotShot' ||
          data.entity.recentActivity.name === 'justDiedShot'
        ) {
          const obsticlePosition = data.entity.recentActivity.obsticlePosition;

          if (!obsticlePosition) {
            return;
          }

          console.log(
            'unitGotShotObsticleBonus: obsticlePosition:',
            obsticlePosition
          );

          instantiateIndicator(obsticlePosition);
        }
      },
      false
    );
  }

  function instantiateIndicator(obsticlePosition) {
    const amountTextStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 13,
      fontWeight: 'bolder',
      fill: 'white',
      strokeThickness: 2
    });

    const text = new PIXI.Text('-80%', amountTextStyle);
    text.name = 'hasBeenCollectedIndicator';
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
