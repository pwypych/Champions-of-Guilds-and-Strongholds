// @format

'use strict';

g.battle.tweenUnitJourney = (walkie, viewport, freshEntities, spriteBucket) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  (function init() {
    onUnitPositionChanged();
  })();

  function onUnitPositionChanged() {
    walkie.onEvent(
      'unitPositionChanged_',
      'tweenUnitJourney.js',
      (data) => {
        const unitId = data.unitId;
        const fromPosition = data.fromPosition;
        const toPosition = data.toPosition;

        generatePathArray(unitId, fromPosition, toPosition);
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

    const finder = new PF.AStarFinder({ allowDiagonal: true });

    console.log('fromPosition', fromPosition);
    console.log('toPosition', toPosition);
    console.log('grid', grid);

    const pathArrayOfArrays = finder.findPath(
      fromPosition.x,
      fromPosition.y,
      toPosition.x,
      toPosition.y,
      grid
    );

    console.log('pathArrayOfArrays', pathArrayOfArrays);

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

    findSpriteAndSpriteOffset(journey, unitId);
  }

  function findSpriteAndSpriteOffset(journey, unitId) {
    const sprite = spriteBucket[unitId];
    if (!sprite) {
      console.log('tweenUnitJourney: ERROR, cannot find sprite');
      return;
    }

    let spriteOffset = freshEntities()[unitId].spriteOffset;
    if (!spriteOffset) {
      spriteOffset = { x: 0, y: 0 };
    }

    generateTweenPath(journey, sprite, spriteOffset);
  }

  function generateTweenPath(journey, sprite, spriteOffset) {
    journey.forEach((step, index) => {
      const fromXPixel = step.fromX * blockWidthPx + spriteOffset.x;
      const fromYPixel =
        step.fromY * blockHeightPx + blockHeightPx + spriteOffset.y;
      const toXPixel = step.toX * blockWidthPx + spriteOffset.x;
      const toYPixel =
        step.toY * blockHeightPx + blockHeightPx + spriteOffset.y;

      console.log(
        'end slide on pixel:',
        toXPixel,
        toYPixel,
        ' currently on pixel:',
        fromXPixel,
        fromYPixel
      );

      TweenMax.fromTo(
        sprite,
        0.25,
        { x: fromXPixel, y: fromYPixel },
        { x: toXPixel, y: toYPixel, delay: index * 0.25 }
      );
    });
  }
};
