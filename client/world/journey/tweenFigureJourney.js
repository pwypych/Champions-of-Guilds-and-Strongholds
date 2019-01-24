// @format

'use strict';

g.world.tweenFigureJourney = (
  walkie,
  viewport,
  freshEntities,
  spriteBucket
) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  (function init() {
    onFigurePositionChanged();
  })();

  function onFigurePositionChanged() {
    walkie.onEvent(
      'figurePositionChanged_',
      'tweenFigureJourney.js',
      (data) => {
        const figureId = data.figureId;
        const fromPosition = data.fromPosition;
        const toPosition = data.toPosition;

        generatePathArray(figureId, fromPosition, toPosition);
      },
      false
    );
  }

  function generatePathArray(figureId, fromPosition, toPosition) {
    const gameEntity = freshEntities()[freshEntities()._id];
    const width = gameEntity.mapData.width;
    const height = gameEntity.mapData.height;

    const grid = new PF.Grid(width, height);

    _.forEach(freshEntities(), (entity) => {
      if (entity.collision) {
        grid.setWalkableAt(entity.position.x, entity.position.y, false);
      }
    });

    const finder = new PF.AStarFinder({ allowDiagonal: true });

    const pathArrayOfArrays = finder.findPath(
      fromPosition.x,
      fromPosition.y,
      toPosition.x,
      toPosition.y,
      grid
    );

    const pathArray = pathArrayOfArrays.map((path) => {
      return { x: path[0], y: path[1] };
    });

    convertPathToJourney(pathArray, figureId);
  }

  function convertPathToJourney(pathArray, figureId) {
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

    findSpriteAndSpriteOffset(journey, figureId);
  }

  function findSpriteAndSpriteOffset(journey, figureId) {
    const sprite = spriteBucket[figureId];
    if (!sprite) {
      console.log('tweenFigureJourney: ERROR, cannot find sprite');
      return;
    }

    let spriteOffset = freshEntities()[figureId].spriteOffset;
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
        fromYPixel,
        ' sprite x, y:',
        sprite.x,
        sprite.y
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
