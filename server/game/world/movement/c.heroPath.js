// @format

'use strict';

// What does this module do?
// It listens to path events, and renders path accordingly
g.autoload.heroPath = (inject) => {
  const viewport = inject.viewport;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  let path;
  let spriteArray = [];
  let heroId;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const worldContainer = viewport.getChildByName('worldContainer');

  (function init() {
    onPathCalculated();
    onPathImpossible();
    onPathAccepted();
  })();

  function onPathCalculated() {
    walkie.onEvent('heroPathCalculatedEvent_', 'heroPath.js', (data) => {
      toolRemoveOldPath();
      path = data.path;
      heroId = data.heroId;
      findHeroMovement();
    });
  }

  function onPathImpossible() {
    walkie.onEvent('heroPathImpossibleEvent_', 'heroPath.js', () => {
      toolRemoveOldPath();
    });
  }

  function onPathAccepted() {
    walkie.onEvent('heroPathAcceptedEvent_', 'heroPath.js', () => {
      toolRemoveOldPath();
    });
  }

  function toolRemoveOldPath() {
    spriteArray.forEach((sprite) => {
      worldContainer.removeChild(sprite);
      sprite.destroy();
    });

    path = [];
    spriteArray = [];
    heroId = undefined;
  }

  function findHeroMovement() {
    const movement = freshEntities()[heroId].heroStats.current.movement;
    forEachPosition(movement);
  }

  function forEachPosition(movement) {
    path.forEach((position, index) => {
      let isFirst = false;
      if (index === 0) {
        isFirst = true;
      }

      let isInRange = true;
      if (index > movement) {
        isInRange = false;
      }

      let isLast = false;
      if (index === path.length - 1) {
        isLast = true;
      }

      let toPosition;
      if (path[index + 1]) {
        toPosition = path[index + 1];
      } else {
        toPosition = position;
      }

      let fromPosition;
      if (path[index - 1]) {
        fromPosition = path[index - 1];
      } else {
        fromPosition = position;
      }

      drawPath(
        position,
        fromPosition,
        toPosition,
        isFirst,
        isInRange,
        isLast,
        index
      );
    });
  }

  function drawPath(
    position,
    fromPosition,
    toPosition,
    isFirst,
    isInRange,
    isLast,
    index
  ) {
    if (isFirst) {
      return;
    }

    const dx = toPosition.x - fromPosition.x;
    const dy = toPosition.y - fromPosition.y;
    const dy2 = position.y - fromPosition.y;

    let textureName = 'pathArrowEnd';
    let rotation = 0;
    let scaleX = 1;

    // console.log('index:', index, 'dx:', dx, 'dy:', dy, 'dy2', dy2);

    // streight down
    if (dx === 0 && dy >= 1) {
      textureName = 'pathArrowStreight';
      rotation = toolDegToRad(180);
    }

    // streight up
    if (dx === 0 && dy <= -1) {
      textureName = 'pathArrowStreight';
      rotation = toolDegToRad(0);
    }

    // streight right
    if (dx >= 1 && dy === 0) {
      textureName = 'pathArrowStreight';
      rotation = toolDegToRad(90);
    }

    // streight left
    if (dx <= -1 && dy === 0) {
      textureName = 'pathArrowStreight';
      rotation = toolDegToRad(270);
    }

    // turn right down
    if (dx === 1 && dy === 1 && dy2 === 0) {
      textureName = 'pathArrowTurn';
      rotation = toolDegToRad(0);
      scaleX = 1;
    }

    // turn down right
    if (dx === 1 && dy === 1 && dy2 === 1) {
      textureName = 'pathArrowTurn';
      rotation = toolDegToRad(-90);
      scaleX = -1;
    }

    // turn left up
    if (dx === -1 && dy === -1 && dy2 === 0) {
      textureName = 'pathArrowTurn';
      rotation = toolDegToRad(180);
      scaleX = 1;
    }

    // turn up left
    if (dx === -1 && dy === -1 && dy2 === -1) {
      textureName = 'pathArrowTurn';
      rotation = toolDegToRad(90);
      scaleX = -1;
    }

    // turn up right
    if (dx === 1 && dy === -1 && dy2 === -1) {
      textureName = 'pathArrowTurn';
      rotation = toolDegToRad(270);
      scaleX = 1;
    }

    // turn right up
    if (dx === 1 && dy === -1 && dy2 === 0) {
      textureName = 'pathArrowTurn';
      rotation = toolDegToRad(180);
      scaleX = -1;
    }

    // turn down left
    if (dx === -1 && dy === 1 && dy2 === 1) {
      textureName = 'pathArrowTurn';
      rotation = toolDegToRad(90);
      scaleX = 1;
    }

    // turn left down
    if (dx === -1 && dy === 1 && dy2 === 0) {
      textureName = 'pathArrowTurn';
      rotation = toolDegToRad(0);
      scaleX = -1;
    }

    if (isLast) {
      textureName = 'pathArrowEnd';
      rotation = 0;
    }

    if (!isInRange) {
      textureName += 'Grey';
    }

    const texture = PIXI.loader.resources[textureName].texture;
    const sprite = new PIXI.Sprite(texture);

    sprite.name = 'pathArrow_' + index;

    spriteArray.push(sprite);
    worldContainer.addChildZ(sprite, 1000);

    sprite.x = position.x * blockWidthPx + blockWidthPx / 2;
    sprite.y = position.y * blockHeightPx + blockHeightPx / 2;

    sprite.anchor = { x: 0.5, y: 0.5 };
    sprite.rotation = rotation;
    sprite.scale.x = scaleX;
  }

  function toolDegToRad(degrees) {
    return (degrees * Math.PI) / 180;
  }

  // function drawPath(fromPosition, toPosition, isFirst, isInRange, isLast) {
  //   let fromX = fromPosition.x * blockWidthPx + 16;
  //   let fromY = fromPosition.y * blockHeightPx + 16;
  //   const toX = toPosition.x * blockWidthPx + 16;
  //   const toY = toPosition.y * blockHeightPx + 16;

  //   if (isFirst) {
  //     // begin line from side of the unit not from center
  //     fromX -= Math.floor((fromX - toX) / 2);
  //     fromY -= Math.floor((fromY - toY) / 2);
  //   }

  //   const gPath = new PIXI.Graphics();

  //   if (isInRange) {
  //     gPath.lineStyle(4, 0x93bd8b, 1); // green
  //   } else {
  //     gPath.lineStyle(4, 0xa7a7a7, 1); // gray
  //   }

  //   gPath.moveTo(fromX, fromY);
  //   gPath.lineTo(toX, toY);
  //   gPath.endFill();

  //   gPathArray.push(gPath);
  //   viewport.addChild(gPath);

  //   if (isLast) {
  //     drawArrowHead(toX, toY, isInRange);
  //   }
  // }

  // function drawArrowHead(x, y, isInRange) {
  //   const gCircle = new PIXI.Graphics();
  //   gCircle.lineStyle(0);

  //   if (isInRange) {
  //     gCircle.beginFill(0x93bd8b, 1); // green
  //   } else {
  //     gCircle.beginFill(0xa7a7a7, 1); // gray
  //   }

  //   gCircle.drawCircle(x, y, 7);
  //   gCircle.endFill();
  //   gPathArray.push(gCircle);
  //   viewport.addChild(gCircle);
  // }
};
