// @format

'use strict';

// What does this module do?
// It listens to path events, and renders path accordingly
g.battle.unitPath = (walkie, auth, viewport, freshEntities) => {
  let pathArray;
  let gPathArray = [];
  let unitId;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  (function init() {
    onPathCalculated();
    onPathImpossible();
    onPathAccepted();
    onWorldRenderDone();
  })();

  function onPathCalculated() {
    walkie.onEvent('unitPathCalculated_', 'unitPath.js', (data) => {
      toolRemoveOldPath();
      pathArray = data.pathArray;
      unitId = data.unitId;
      findUnitMovement();
    });
  }

  function onPathImpossible() {
    walkie.onEvent('unitPathImpossible_', 'unitPath.js', () => {
      toolRemoveOldPath();
    });
  }

  function onPathAccepted() {
    walkie.onEvent('unitPathAccepted_', 'unitPath.js', () => {
      toolRemoveOldPath();
    });
  }

  function onWorldRenderDone() {
    walkie.onEvent(
      'renderDone_',
      'unitPath.js',
      () => {
        if (!_.isEmpty(pathArray)) {
          findUnitMovement();
        }
      },
      false
    );
  }

  function toolRemoveOldPath() {
    gPathArray.forEach((gPath) => {
      viewport.removeChild(gPath);
    });

    pathArray = [];
    gPathArray = [];
    unitId = undefined;
  }

  function findUnitMovement() {
    const unitEntity = freshEntities()[unitId];
    const movement = unitEntity.unitStats.current.movement;

    forEachPosition(movement);
  }

  function forEachPosition(movement) {
    pathArray.forEach((fromPosition, index) => {
      if (pathArray.length === index + 1) {
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
      if (index === pathArray.length - 2) {
        isLast = true;
      }

      const toPosition = pathArray[index + 1];

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

    const path = new PIXI.tween.TweenPath();
    path.moveTo(fromX, fromY).lineTo(toX, toY);

    const gPath = new PIXI.Graphics();

    if (isInRange) {
      gPath.lineStyle(4, 0x93bd8b, 1); // green
    } else {
      gPath.lineStyle(4, 0xa7a7a7, 1); // gray
    }

    gPath.drawPath(path);
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
