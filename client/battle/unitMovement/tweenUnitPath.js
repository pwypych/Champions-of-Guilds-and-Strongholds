// @format

'use strict';

g.battle.tweenUnitPath = (walkie, viewport) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onUnitPositionChanged();
  })();

  function onUnitPositionChanged() {
    walkie.onEvent(
      'unitPathVerifiedByServer_',
      'tweenUnitPath.js',
      (data) => {
        const unitId = data.unitId;
        const unitPath = data.unitPath;

        findSprite(unitId, unitPath);
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

      timeline.to(sprite, 0.2, { x: xPixel, y: yPixel });
    });

    timeline.pause();
    timeline.play();
  }
};
