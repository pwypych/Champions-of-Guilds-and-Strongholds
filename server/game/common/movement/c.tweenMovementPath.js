// @format

'use strict';

// What does this module do?
// Tweens an entitiy through a path in both battle and world state when server confirms movement,
// or when recent activity onMovement has been recieved. That way it moves player unit right
// after clicking, and moves enemy unit on server changes
g.autoload.tweenMovementPath = (inject) => {
  const walkie = inject.walkie;
  const viewport = inject.viewport;

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
      'recentActivityDifferanceFoundEvent_',
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
      'entityTweenStartEvent_',
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
      'entityTweenEndEvent_',
      'tweenMovementPath.js',
      {
        entityId: entityId,
        position: position,
      },
      true
    );
  }
};
