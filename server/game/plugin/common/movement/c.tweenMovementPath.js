// @format

'use strict';

g.common.tweenMovementPath = (walkie, viewport) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');
  const worldContainer = viewport.getChildByName('worldContainer');

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
          console.log('tweenMovementPath: onMovement: entityId:', entityId);
          findEntityContainer(entityId, path);
        }
      },
      false
    );
  }

  function findEntityContainer(entityId, path) {
    let entityContainer = worldContainer.getChildByName(entityId);

    if (!entityContainer) {
      entityContainer = battleContainer.getChildByName(entityId);
    }

    generateTweenTimeline(entityContainer, path, entityId);
  }

  function generateTweenTimeline(entityContainer, path, entityId) {
    const timeline = new TimelineMax();

    path.forEach((position, index) => {
      if (index === 0) {
        // first position in path is always current position
        return;
      }
      const xPixel = position.x * blockWidthPx;
      const yPixel = position.y * blockHeightPx;
      const zOrder = 100.5 + position.y; // halv here to make transition faster

      console.log('generateTweenTimeline', xPixel, yPixel, zOrder);

      timeline.to(entityContainer, 0.15, {
        x: xPixel,
        y: yPixel,
        zOrder: zOrder
      });
    });

    const time = Math.round(0.15 * (path.length - 1) * 1000);
    const position = path[path.length - 1];
    triggerEntityTweenStart(entityId, position, time);

    timeline.addCallback(() => {
      triggerEntityTweenEnd(entityId, position);

      setTimeout(() => {
        tweeningEntityIdByPathVerifiedByServer = undefined;
      }, 500); // wait with removing flag until new tick
    });

    timeline.play();
  }

  function triggerEntityTweenStart(entityId, position, time) {
    walkie.triggerEvent(
      'entityTweenStart_',
      'tweenMovementPath.js',
      {
        entityId: entityId,
        position: position,
        time: time
      },
      true
    );
  }

  function triggerEntityTweenEnd(entityId, position) {
    walkie.triggerEvent(
      'entityTweenEnd_',
      'tweenMovementPath.js',
      {
        entityId: entityId,
        position: position,
      },
      true
    );
  }
};
