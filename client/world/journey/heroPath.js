// @format

'use strict';

// What does this module do?
// It listens to path events, and renders path accordingly
g.world.heroPath = (walkie, auth, viewport) => {
  let pathArray;
  let gPathArray = [];

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  (function init() {
    onPathCalculated();
    onPathImpossible();
    onPathAccepted();
    onWorldRenderDone();
  })();

  function onPathCalculated() {
    walkie.onEvent('heroPathCalculated_', 'heroPath.js', (data) => {
      toolRemoveOldPath();
      pathArray = data.pathArray;
      forEachPosition();
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

  function onWorldRenderDone() {
    walkie.onEvent(
      'renderDone_',
      'heroPath.js',
      () => {
        if (!_.isEmpty(pathArray)) {
          forEachPosition();
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
  }

  function forEachPosition() {
    pathArray.forEach((fromPosition, index) => {
      if (pathArray.length === index + 1) {
        return;
      }

      const toPosition = pathArray[index + 1];

      // console.log('fromPosition', fromPosition);
      // console.log('toPosition', toPosition);

      drawPath(fromPosition, toPosition);
    });
  }

  function drawPath(fromPosition, toPosition) {
    const fromX = fromPosition.x * blockWidthPx + 16;
    const fromY = fromPosition.y * blockHeightPx + 16;
    const toX = toPosition.x * blockWidthPx + 16;
    const toY = toPosition.y * blockHeightPx + 16;

    const path = new PIXI.tween.TweenPath();
    path.moveTo(fromX, fromY).lineTo(toX, toY);

    const gPath = new PIXI.Graphics();
    gPath.lineStyle(4, 0x60b450, 0.5);
    gPath.drawPath(path);
    gPathArray.push(gPath);
    viewport.addChild(gPath);
  }
};
