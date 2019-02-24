// @format

'use strict';

g.battle.tweenPathUnit = (walkie, viewport) => {
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
      'tweenPathUnit.js',
      (data) => {
        const unitId = data.unitId;
        const path = data.path;

        tweeningUnitIdByPathVerifiedByServer = unitId;

        findUnitContainer(unitId, path);
      },
      true
    );
  }

  function onRecentActivityDifferance() {
    walkie.onEvent(
      'recentActivityDifferanceFound_',
      'tweenPathUnit.js',
      (data) => {
        if (data.unitId === tweeningUnitIdByPathVerifiedByServer) {
          console.log('tweenPathUnit: Preventing double tweening!');
          return;
        }

        if (data.entity.recentActivity.name === 'onMovement') {
          const unitId = data.unitId;
          const path = data.entity.recentActivity.path;
          findUnitContainer(unitId, path);
        }
      },
      true
    );
  }

  function findUnitContainer(unitId, path) {
    const unitContainer = battleContainer.getChildByName(unitId);

    generateTweenTimeline(unitContainer, path);
  }

  function generateTweenTimeline(unitContainer, path) {
    const timeline = new TimelineMax();

    path.forEach((position, index) => {
      if (index === 0) {
        // first position in path is always current position
        return;
      }
      const xPixel = position.x * blockWidthPx;
      const yPixel = position.y * blockHeightPx;

      console.log('generateTweenTimeline', xPixel, yPixel);

      timeline.to(unitContainer, 0.15, { x: xPixel, y: yPixel });
    });

    timeline.addCallback(() => {
      setTimeout(() => {
        tweeningUnitIdByPathVerifiedByServer = undefined;
      }, 500); // wait with removing flag until new tick
    });

    timeline.play();
  }
};
