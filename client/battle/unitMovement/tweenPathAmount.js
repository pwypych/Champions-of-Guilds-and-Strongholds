// @format

'use strict';

g.battle.tweenPathAmount = (walkie, viewport) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  let tweeningUnitIdByPathVerifiedByServer;

  (function init() {
    onUnitPathVerifiedByServer();
    onRecentActivityDifferance();
  })();

  function onUnitPathVerifiedByServer() {
    walkie.onEvent(
      'pathVerifiedByServer_',
      'tweenPathAmount.js',
      (data) => {
        const unitId = data.unitId;
        const path = data.path;

        tweeningUnitIdByPathVerifiedByServer = unitId;

        findSprite(unitId, path);
      },
      true
    );
  }

  function onRecentActivityDifferance() {
    walkie.onEvent(
      'recentActivityDifferanceFound_',
      'tweenPathAmount.js',
      (data) => {
        if (data.unitId === tweeningUnitIdByPathVerifiedByServer) {
          console.log('tweenPathAmount: Preventing double tweening!');
          return;
        }

        if (data.entity.recentActivity.name === 'onMovement') {
          const unitId = data.unitId;
          const path = data.entity.recentActivity.path;
          findSprite(unitId, path);
        }
      },
      true
    );
  }

  function findSprite(unitId, path) {
    const sprite = battleContainer.getChildByName('amount_' + unitId);

    generateTweenTimeline(sprite, path);
  }

  function generateTweenTimeline(sprite, path) {
    const timeline = new TimelineMax();

    path.forEach((position, index) => {
      if (index === 0) {
        // first position in path is always current position
        return;
      }

      const paddingRight = 2;
      const paddingTop = 3;
      const xPixel =
        position.x * blockWidthPx + blockWidthPx - sprite.width + paddingRight;
      const yPixel =
        position.y * blockHeightPx + blockHeightPx - sprite.height + paddingTop;

      console.log('generateTweenTimeline', xPixel, yPixel);

      timeline.to(sprite, 0.15, { x: xPixel, y: yPixel });
    });

    timeline.addCallback(() => {
      setTimeout(() => {
        tweeningUnitIdByPathVerifiedByServer = undefined;
      }, 500); // wait with removing flag until new tick
    });

    timeline.play();
  }
};
