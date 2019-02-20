// @format

'use strict';

g.battle.tweenUnitJourney = (walkie, viewport, freshEntities) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onUnitPositionChanged();
  })();

  function onUnitPositionChanged() {
    walkie.onEvent(
      'recentManeuverDifferanceFound_',
      'tweenUnitJourney.js',
      (data) => {
        if (data.entity.recentManeuver.name === 'onJourney') {
          const unitId = data.unitId;
          const journey = data.entity.recentManeuver.unitJourney;

          console.log('!!!', unitId, journey);
          createTweenSprite(unitId, journey);
        }
      },
      true
    );
  }

  function createTweenSprite(unitId, journey) {
    // const entity = freshEntities()[unitId];

    // const texture = PIXI.loader.resources[entity.unitName].texture;
    // const tweenSprite = new PIXI.Sprite(texture);

    // tweenSprite.anchor = { x: 0, y: 1 };

    // const fromXPixel = journey[0].fromX * blockWidthPx;
    // const fromYPixel = journey[0].fromY * blockHeightPx + blockHeightPx;

    // tweenSprite.x = fromXPixel;
    // tweenSprite.y = fromYPixel;

    // const zIndex = 100 + fromYPixel;

    // battleContainer.addChildZ(tweenSprite, zIndex);

    const sprite = battleContainer.getChildByName(unitId);
    sprite.isTweening = true;

    setTimeout(() => {
      sprite.isTweening = false;
    }, 0.2 * journey.length + 1);

    generateTweenTimeline(journey, sprite);
  }

  // instantiate new tweenSprite
  // hide real sprite
  // use timelinemax to animate
  // show real sprite
  // delete tweenSprite

  function generateTweenTimeline(journey, tweenSprite, sprite) {
    const timeline = new TimelineMax();

    journey.forEach((step) => {
      const fromXPixel = step.fromX * blockWidthPx;
      const fromYPixel = step.fromY * blockHeightPx + blockHeightPx;
      const toXPixel = step.toX * blockWidthPx;
      const toYPixel = step.toY * blockHeightPx + blockHeightPx;

      console.log(
        'end slide on pixel:',
        toXPixel,
        toYPixel,
        ' currently on pixel:',
        fromXPixel,
        fromYPixel
      );

      timeline.to(
        tweenSprite,
        0.2,
        { x: toXPixel, y: toYPixel }
        // { x: 0, y: 0 },
        // { x: 200, y: 200 }
      );
    });

    timeline.pause();
    timeline.play();
  }

  // function generateTweenPath(journey, unitId) {
  //   // const done = _.after(1, () => {
  //   //   console.log('done steps', sprite);
  //   //   // sprite.visible = false;
  //   //   // battleContainer.removeChild(sprite);
  //   //   // sprite.destroy();
  //   // });

  //   journey.forEach((step, index) => {
  //     const fromXPixel = step.fromX * blockWidthPx;
  //     const fromYPixel = step.fromY * blockHeightPx + blockHeightPx;
  //     const toXPixel = step.toX * blockWidthPx;
  //     const toYPixel = step.toY * blockHeightPx + blockHeightPx;

  //     const sprite = createSprite(fromXPixel, fromYPixel, unitId);

  //     console.log(
  //       'end slide on pixel:',
  //       toXPixel,
  //       toYPixel,
  //       ' currently on pixel:',
  //       fromXPixel,
  //       fromYPixel
  //     );

  //     TweenMax.fromTo(
  //       sprite,
  //       0.2,
  //       { x: fromXPixel, y: fromYPixel },
  //       {
  //         x: toXPixel,
  //         y: toYPixel
  //       }
  //     );

  //     setTimeout(() => {
  //       sprite.visible = false;
  //     }, 200);

  //     setTimeout(() => {
  //       // sprite.destroy();
  //       // battleContainer.removeChild(sprite);
  //     }, 300);
  //   });
  // }

  // function createSprite(fromXPixel, fromYPixel, unitId) {
  //   const entity = freshEntities()[unitId];
  //   const texture = PIXI.loader.resources[entity.unitName].texture;
  //   const sprite = new PIXI.Sprite(texture);

  //   sprite.anchor = { x: 0, y: 1 };

  //   sprite.x = fromXPixel;
  //   sprite.y = fromYPixel;

  //   const zIndex = 100 + fromYPixel;
  //   battleContainer.addChildZ(sprite, zIndex);

  //   return sprite;
  // }
};
