// @format

'use strict';

// What does this module do?
// Adds indicator after hero collects a resource
g.autoload.hasBeenCollectedIndicate = (inject) => {
  const walkie = inject.walkie;
  const viewport = inject.viewport;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const worldContainer = viewport.getChildByName('worldContainer');

  (function init() {
    onRecentActivityDifferance();
  })();

  function onRecentActivityDifferance() {
    walkie.onEvent(
      'recentActivityDifferanceFoundEvent_',
      'hasBeenCollectedIndicate.js',
      (data) => {
        if (data.entity.recentActivity.name === 'hasBeenCollected') {
          const position = data.entity.position;
          const amount = data.entityOld.resource.amount;

          console.log('hasBeenCollectedIndicate: entityId:', data.entityId);
          instantiateIndicator(position, amount);
        }
      },
      false
    );
  }

  function instantiateIndicator(position, amount) {
    const amountTextStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 13,
      fontWeight: 'bolder',
      fill: 'white',
      strokeThickness: 2
    });

    const amountText = new PIXI.Text('+' + amount, amountTextStyle);
    amountText.name = 'hasBeenCollectedIndicator';
    worldContainer.addChild(amountText);
    amountText.x =
      blockWidthPx * position.x + blockWidthPx / 2 - amountText.width / 2;
    amountText.y =
      blockHeightPx * position.y + blockHeightPx / 2 - amountText.height / 2;

    destroyAfterTimeout(amountText);
  }

  function destroyAfterTimeout(amountText) {
    setTimeout(() => {
      amountText.destroy();
    }, 500);
  }
};
