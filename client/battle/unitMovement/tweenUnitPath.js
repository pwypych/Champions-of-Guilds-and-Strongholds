// @format

'use strict';

g.battle.tweenUnitPath = (walkie, viewport) => {
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
      'unitPathVerifiedByServer_',
      'tweenUnitPath.js',
      (data) => {
        const unitId = data.unitId;
        const unitPath = data.unitPath;

        tweeningUnitIdByPathVerifiedByServer = unitId;

        findSprite(unitId, unitPath);
      },
      true
    );
  }

  function onRecentActivityDifferance() {
    walkie.onEvent(
      'recentActivityDifferanceFound_',
      'tweenUnitPath.js',
      (data) => {
        if (data.unitId === tweeningUnitIdByPathVerifiedByServer) {
          console.log('tweenUnitPath: Preventing double tweening!');
          return;
        }

        if (data.entity.recentActivity.name === 'onMovement') {
          const unitId = data.unitId;
          const unitPath = data.entity.recentActivity.unitPath;
          findSprite(unitId, unitPath);
        }
      },
      true
    );
  }

  function findSprite(unitId, unitPath) {
    const sprite = battleContainer.getChildByName(unitId);

    generateTweenTimeline(sprite, unitPath);
  }

  function generateTweenTimeline(sprite, unitPath) {
    const timeline = new TimelineMax();

    unitPath.forEach((position, index) => {
      if (index === 0) {
        // first position in path is always current position
        return;
      }
      const xPixel = position.x * blockWidthPx;
      const yPixel = position.y * blockHeightPx + blockHeightPx;

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
