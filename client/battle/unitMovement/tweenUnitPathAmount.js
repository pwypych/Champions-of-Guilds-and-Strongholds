// @format

'use strict';

g.battle.tweenUnitPathAmount = (walkie, viewport) => {
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
      'tweenUnitPathAmount.js',
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
      'tweenUnitPathAmount.js',
      (data) => {
        if (data.unitId === tweeningUnitIdByPathVerifiedByServer) {
          console.log('tweenUnitPathAmount: Preventing double tweening!');
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
    const sprite = battleContainer.getChildByName('amount_' + unitId);

    generateTweenTimeline(sprite, unitPath);
  }

  function generateTweenTimeline(sprite, unitPath) {
    const timeline = new TimelineMax();

    unitPath.forEach((position, index) => {
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
      tweeningUnitIdByPathVerifiedByServer = undefined;
    });

    timeline.play();
  }
};
