// @format

'use strict';

g.battle.unitGotShotAnimation = (walkie, viewport) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onRecentActivityDifferance();
  })();

  function onRecentActivityDifferance() {
    walkie.onEvent(
      'recentActivityDifferanceFound_',
      'unitGotShotAnimation.js',
      (data) => {
        if (data.entity.recentActivity.name === 'gotShot') {
          const unitPosition = data.entity.position;
          const shootFromPosition =
            data.entity.recentActivity.shootFromPosition;
          console.log('unitGotShotAnimation: unitPosition:', unitPosition);
          console.log(
            'unitGotShotAnimation: shootFromPosition:',
            shootFromPosition
          );
          instantiateSprite(shootFromPosition, unitPosition);
        }
      },
      false
    );
  }

  function instantiateSprite(shootFromPosition, unitPosition) {
    const textureName = 'arrow';
    const texture = PIXI.loader.resources[textureName].texture;
    const sprite = new PIXI.Sprite(texture);

    sprite.name = 'arrow';
    battleContainer.addChild(sprite);

    sprite.x = shootFromPosition.x * blockWidthPx + 16;
    sprite.y = shootFromPosition.y * blockHeightPx + 16;
    sprite.anchor = { x: 0.5, y: 0.5 };

    // flip sprite if shooting from other direction
    if (shootFromPosition.x > unitPosition.x) {
      sprite.rotation = toolDegToRad(180);
    }

    generateTween(sprite, unitPosition);
    destroyAfterTimeout(sprite);
  }

  function generateTween(sprite, unitPosition) {
    TweenMax.to(sprite, 0.7, {
      x: unitPosition.x * blockWidthPx + 16,
      y: unitPosition.y * blockHeightPx + 16,
      ease: 'Strong'
    });
  }

  function destroyAfterTimeout(sprite) {
    setTimeout(() => {
      sprite.destroy();
    }, 700);
  }

  function toolDegToRad(degrees) {
    return (degrees * Math.PI) / 180;
  }
};
