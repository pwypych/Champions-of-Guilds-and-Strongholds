// @format

'use strict';

g.common.tweenMovementPath = (walkie, viewport) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  let tweeningEntityIdByPathVerifiedByServer;

  (function init() {
    onEntityPathVerifiedByServer();
    onRecentActivityDifferance();
  })();

  function onEntityPathVerifiedByServer() {
    walkie.onEvent(
      'movementPathVerifiedByServer_',
      'tweenMovementPath.js',
      (data) => {
        const entityId = data.entityId;
        const path = data.path;

        tweeningEntityIdByPathVerifiedByServer = entityId;

        findEntityContainer(entityId, path);
      },
      true
    );
  }

  function onRecentActivityDifferance() {
    walkie.onEvent(
      'recentActivityDifferanceFound_',
      'tweenMovementPath.js',
      (data) => {
        if (data.entityId === tweeningEntityIdByPathVerifiedByServer) {
          console.log('tweenMovementPath: Preventing double tweening!');
          return;
        }

        if (data.entity.recentActivity.name === 'onMovement') {
          const entityId = data.entityId;
          const path = data.entity.recentActivity.path;
          findEntityContainer(entityId, path);
        }
      },
      true
    );
  }

  function findEntityContainer(entityId, path) {
    const entityContainer = battleContainer.getChildByName(entityId);

    generateTweenTimeline(entityContainer, path);
  }

  function generateTweenTimeline(entityContainer, path) {
    const timeline = new TimelineMax();

    path.forEach((position, index) => {
      if (index === 0) {
        // first position in path is always current position
        return;
      }
      const xPixel = position.x * blockWidthPx;
      const yPixel = position.y * blockHeightPx;

      console.log('generateTweenTimeline', xPixel, yPixel);

      timeline.to(entityContainer, 0.15, { x: xPixel, y: yPixel });
    });

    timeline.addCallback(() => {
      setTimeout(() => {
        tweeningEntityIdByPathVerifiedByServer = undefined;
      }, 500); // wait with removing flag until new tick
    });

    timeline.play();
  }
};
