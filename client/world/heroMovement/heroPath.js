// @format

'use strict';

// What does this module do?
// It listens to path events, and renders path accordingly
g.world.heroPath = (walkie, auth, viewport, freshEntities) => {
  let path;
  let gPathArray = [];
  let heroId;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  (function init() {
    onPathCalculated();
    onPathImpossible();
    onPathAccepted();
  })();

  function onPathCalculated() {
    walkie.onEvent('heroPathCalculated_', 'heroPath.js', (data) => {
      toolRemoveOldPath();
      path = data.path;
      heroId = data.heroId;
      findHeroMovement();
    });
  }

  function onPathImpossible() {
    walkie.onEvent('heroPathImpossible_', 'heroPath.js', () => {
      toolRemoveOldPath();
    });
  }

  function onPathAccepted() {
    walkie.onEvent('heroPathAccepted_', 'heroPath.js', () => {
      toolRemoveOldPath();
    });
  }

  function toolRemoveOldPath() {
    gPathArray.forEach((gPath) => {
      viewport.removeChild(gPath);
    });

    path = [];
    gPathArray = [];
    heroId = undefined;
  }

  function findHeroMovement() {
    const movement = freshEntities()[heroId].heroStats.current.movement;
    forEachPosition(movement);
  }

  function forEachPosition(movement) {
    path.forEach((fromPosition, index) => {
      if (path.length === index + 1) {
        return;
      }

      let isFirst = false;
      if (index === 0) {
        isFirst = true;
      }

      let isInRange = true;
      if (index + 1 > movement) {
        isInRange = false;
      }

      let isLast = false;
      // path always one longer than step count
      if (index === path.length - 2) {
        isLast = true;
      }

      const toPosition = path[index + 1];

      drawPath(fromPosition, toPosition, isFirst, isInRange, isLast);
    });
  }

  function drawPath(fromPosition, toPosition, isFirst, isInRange, isLast) {
    let fromX = fromPosition.x * blockWidthPx + 16;
    let fromY = fromPosition.y * blockHeightPx + 16;
    const toX = toPosition.x * blockWidthPx + 16;
    const toY = toPosition.y * blockHeightPx + 16;

    if (isFirst) {
      // begin line from side of the unit not from center
      fromX -= Math.floor((fromX - toX) / 2);
      fromY -= Math.floor((fromY - toY) / 2);
    }

    const gPath = new PIXI.Graphics();

    if (isInRange) {
      gPath.lineStyle(4, 0x93bd8b, 1); // green
    } else {
      gPath.lineStyle(4, 0xa7a7a7, 1); // gray
    }

    gPath.moveTo(fromX, fromY);
    gPath.lineTo(toX, toY);
    gPath.endFill();

    gPathArray.push(gPath);
    viewport.addChild(gPath);

    if (isLast) {
      drawArrowHead(toX, toY, isInRange);
    }
  }

  function drawArrowHead(x, y, isInRange) {
    const gCircle = new PIXI.Graphics();
    gCircle.lineStyle(0);

    if (isInRange) {
      gCircle.beginFill(0x93bd8b, 1); // green
    } else {
      gCircle.beginFill(0xa7a7a7, 1); // gray
    }

    gCircle.drawCircle(x, y, 7);
    gCircle.endFill();
    gPathArray.push(gCircle);
    viewport.addChild(gCircle);
  }
};
