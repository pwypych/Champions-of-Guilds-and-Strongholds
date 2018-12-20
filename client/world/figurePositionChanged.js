// @format

'use strict';

g.world.figurePositionChanged = (walkie, viewport, freshEntities) => {
  const lastPosition = [];

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  (function init() {
    onFigurePositionChanged();
  })();

  function onFigurePositionChanged() {
    walkie.onEvent(
      'figurePositionChanged_',
      'figurePositionChanged.js',
      (data) => {
        const figureId = data.figureId;
        const fromPosition = data.fromPosition;
        const toPosition = data.toPosition;

        findFigure(figureId, fromPosition, toPosition);
      },
      false
    );
  }

  function findFigure(figureId, fromPosition, toPosition) {
    // const figure = freshEntities()[figureId];
    findSprite(figureId, fromPosition, toPosition);
  }

  function findSprite(x, y, playerIndex) {
    checkPositionChange(x, y, playerIndex);
  }

  function tweenFigureToNewPosition(
    moveToX,
    moveToY,
    lastKnownX,
    lastKnownY,
    playerIndex
  ) {
    const heroSpriteOffsetX = -9;

    const tweenX = moveToX * blockWidthPx + heroSpriteOffsetX;
    const tweenY = moveToY * blockHeightPx + blockHeightPx;
    const heroX = lastKnownX * blockWidthPx + heroSpriteOffsetX;
    const heroY = lastKnownY * blockHeightPx + blockHeightPx;

    lastPosition[playerIndex].x = moveToX;
    lastPosition[playerIndex].y = moveToY;

    // console.log(
    //   'end slide on:',
    //   tweenX,
    //   tweenY,
    //   'hero currently on:',
    //   heroX,
    //   heroY
    // );

    const path = new PIXI.tween.TweenPath();
    path.moveTo(heroX, heroY).lineTo(tweenX, tweenY);

    const gPath = new PIXI.Graphics();
    gPath.lineStyle(1, 0xffffff, 1);
    gPath.drawPath(path);
    // viewport.addChild(gPath);

    const tween = PIXI.tweenManager.createTween(sprite);
    tween.path = path;
    tween.time = 16000;
    tween.loop = false;
    tween.start();
  }
};
