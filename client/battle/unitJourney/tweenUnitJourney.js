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
        if (data.entity.recentManeuver.name === 'unitJourney') {
          const unitId = data.unitId;
          const fromPosition = data.entityOld.position;
          const toPosition = data.entity.position;

          // pixiFactory.getSpriteList()[unitId].visible = false;

          generatePathArray(unitId, fromPosition, toPosition);
        }
      },
      true
    );
  }

  function generatePathArray(unitId, fromPosition, toPosition) {
    let battleEntity;
    _.forEach(freshEntities(), (entity) => {
      if (entity.battleStatus === 'active') {
        battleEntity = entity;
      }
    });
    const width = battleEntity.battleWidth;
    const height = battleEntity.battleHeight;

    const grid = new PF.Grid(width, height);

    _.forEach(freshEntities(), (entity, id) => {
      if (entity.collision && id !== unitId) {
        // unit that is moved cannot have collision on grid
        grid.setWalkableAt(entity.position.x, entity.position.y, false);
      }
    });

    const finder = new PF.AStarFinder({ allowDiagonal: false, weight: 2 });

    console.log('fromPosition', fromPosition);
    console.log('toPosition', toPosition);
    // console.log('grid', grid);

    const pathArrayOfArrays = finder.findPath(
      fromPosition.x,
      fromPosition.y,
      toPosition.x,
      toPosition.y,
      grid
    );

    // console.log('pathArrayOfArrays', pathArrayOfArrays);

    const pathArray = pathArrayOfArrays.map((path) => {
      return { x: path[0], y: path[1] };
    });

    console.log('pathArray', pathArray);

    convertPathToJourney(pathArray, unitId);
  }

  function convertPathToJourney(pathArray, unitId) {
    const journey = [];
    pathArray.forEach((pointFrom, index) => {
      if (index === pathArray.length - 1) {
        return;
      }

      const pointTo = pathArray[index + 1];

      journey.push({
        fromX: pointFrom.x,
        fromY: pointFrom.y,
        toX: pointTo.x,
        toY: pointTo.y
      });
    });

    createTweenSprite(journey, unitId);
  }

  function createTweenSprite(journey, unitId) {
    const entity = freshEntities()[unitId];

    const texture = PIXI.loader.resources[entity.unitName].texture;
    const tweenSprite = new PIXI.Sprite(texture);

    tweenSprite.anchor = { x: 0, y: 1 };

    const fromXPixel = journey[0].fromX * blockWidthPx;
    const fromYPixel = journey[0].fromY * blockHeightPx + blockHeightPx;

    tweenSprite.x = fromXPixel;
    tweenSprite.y = fromYPixel;

    const zIndex = 100 + fromYPixel;

    battleContainer.addChildZ(tweenSprite, zIndex);

    const sprite = battleContainer.getChildByName(unitId);
    // sprite.isTweening = true;
    // sprite.visible = false;

    generateTweenTimeline(journey, tweenSprite, sprite);
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

      timeline.add(
        TweenMax.fromTo(
          tweenSprite,
          0.3,
          { x: fromXPixel, y: fromYPixel },
          { x: toXPixel, y: toYPixel }
          // { x: 0, y: 0 },
          // { x: 200, y: 200 }
        )
      );
    });

    timeline.addCallback(() => {
      // tweenSprite.visible = false;
      // sprite.visible = true;
      // sprite.isTweening = false;
    });

    timeline.pause();
    timeline.play();

    console.log('timeline', timeline);
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
