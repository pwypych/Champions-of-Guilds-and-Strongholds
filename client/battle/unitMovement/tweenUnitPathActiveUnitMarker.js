// @format

'use strict';

g.battle.tweenUnitPathActiveUnitMarker = (walkie, viewport) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  let tweeningUnitIdByPathVerifiedByServer;

  (function init() {
    onUnitPathVerifiedByServer();
    onRecentManeuverDifferance();
  })();

  function onUnitPathVerifiedByServer() {
    walkie.onEvent(
      'unitPathVerifiedByServer_',
      'tweenUnitPathActiveUnitMarker.js',
      (data) => {
        const unitId = data.unitId;
        const unitPath = data.unitPath;

        tweeningUnitIdByPathVerifiedByServer = unitId;

        findSprite(unitId, unitPath);
      },
      true
    );
  }

  function onRecentManeuverDifferance() {
    walkie.onEvent(
      'recentManeuverDifferanceFound_',
      'tweenUnitPathActiveUnitMarker.js',
      (data) => {
        if (data.unitId === tweeningUnitIdByPathVerifiedByServer) {
          console.log(
            'tweenUnitPathActiveUnitMarker: Preventing double tweening!'
          );
          return;
        }

        if (data.entity.recentManeuver.name === 'onMovement') {
          const unitId = data.unitId;
          const unitPath = data.entity.recentManeuver.unitPath;
          findSprite(unitId, unitPath);
        }
      },
      true
    );
  }

  function findSprite(unitId, unitPath) {
    const sprite = battleContainer.getChildByName('activeUnitMarker_' + unitId);

    generateTweenTimeline(sprite, unitPath);
  }

  function generateTweenTimeline(sprite, unitPath) {
    const timeline = new TimelineMax();

    unitPath.forEach((position, index) => {
      if (index === 0) {
        // first position in path is always current position
        return;
      }

      const offsetY = 2;
      const xPixel = position.x * blockWidthPx;
      const yPixel = position.y * blockHeightPx + blockHeightPx + offsetY;

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
