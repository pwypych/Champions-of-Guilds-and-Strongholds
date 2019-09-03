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

    sprite.rotation = toolCalculateTwoPointAngle(
      shootFromPosition,
      unitPosition
    );

    // rotate sprite 180 if shooting from right to left
    if (shootFromPosition.x > unitPosition.x) {
      sprite.rotation += Math.PI;
    }

    const distance = toolCalculateTwoPointDistance(
      shootFromPosition,
      unitPosition
    );

    const speed = 24; // 24 tiles per second
    const animationTimeInSeconds = distance / speed;

    generateTween(sprite, unitPosition, animationTimeInSeconds);
    hideAfterTimeout(sprite, animationTimeInSeconds);
  }

  function generateTween(sprite, unitPosition, animationTimeInSeconds) {
    TweenMax.to(sprite, animationTimeInSeconds, {
      x: unitPosition.x * blockWidthPx + 16,
      y: unitPosition.y * blockHeightPx + 16,
      ease: Power0.easeNone
    });
  }

  function hideAfterTimeout(sprite, animationTimeInSeconds) {
    setTimeout(() => {
      sprite.visible = false;
      destroyAfterTimeout(sprite);
    }, animationTimeInSeconds * 1000);
  }

  function destroyAfterTimeout(sprite) {
    setTimeout(() => {
      sprite.destroy();
    }, 500);
  }

  function toolCalculateTwoPointAngle(fromPosition, toPosition) {
    const m = (toPosition.y - fromPosition.y) / (toPosition.x - fromPosition.x);
    const radians = Math.atan(m);
    return radians;
  }

  function toolCalculateTwoPointDistance(fromPosition, toPosition) {
    // dist = sq( (to.x - from.x)^2 + (to.y - from.y)^2 )
    /* eslint-disable no-restricted-properties */
    const a = Math.pow(toPosition.x - fromPosition.x, 2);
    const b = Math.pow(toPosition.y - fromPosition.y, 2);
    /* eslint-enable no-restricted-properties */
    const distance = Math.sqrt(a + b);
    return distance;
  }

  // function toolDegToRad(degrees) {
  //   return (degrees * Math.PI) / 180;
  // }

  // function toolRadToDeg(rad) {
  //   return rad * (180 / Math.PI);
  // }
};
