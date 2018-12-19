// @format

'use strict';

// What does this module do?
// It listens to mouse click events, generates path through library and sends path events
g.world.worldSingleClick = (walkie, auth, viewport, freshEntities) => {
  let lastPathPositionX;
  let lastPathPositionY;

  (function init() {
    addListener();
  })();

  function addListener() {
    viewport.on('clicked', (event) => {
      if (freshEntities().state !== 'worldState') {
        return;
      }

      calculateClickedTile(event);
    });
  }

  function calculateClickedTile(event) {
    const clickX = Math.floor(event.world.x / 32);
    const clickY = Math.floor(event.world.y / 32);

    findHeroYX(clickX, clickY);
  }

  function findHeroYX(clickX, clickY) {
    const playerArray = freshEntities().playerArray;
    const playerIndex = freshEntities().playerIndex;

    const heroX = parseInt(playerArray[playerIndex].hero.x, 10);
    const heroY = parseInt(playerArray[playerIndex].hero.y, 10);

    generatePathGrid(clickX, clickY, heroX, heroY);
  }

  function generatePathGrid(clickX, clickY, heroX, heroY) {
    const width = freshEntities().mapLayer[0].length;
    const height = freshEntities().mapLayer.length;

    const grid = new PF.Grid(width, height);

    freshEntities().mapLayer.forEach((row, y) => {
      row.forEach((figure, x) => {
        if (figure.collision) {
          grid.setWalkableAt(x, y, false);
        }
      });
    });

    const finder = new PF.AStarFinder({ allowDiagonal: true });

    const pathArrayOfArrays = finder.findPath(
      heroX,
      heroY,
      clickX,
      clickY,
      grid
    );

    const pathArray = pathArrayOfArrays.map((path) => {
      return { x: path[0], y: path[1] };
    });

    triggerEvents(pathArray, clickX, clickY);
  }

  function triggerEvents(pathArray, clickX, clickY) {
    if (lastPathPositionX && lastPathPositionY) {
      if (lastPathPositionX === clickX && lastPathPositionY === clickY) {
        lastPathPositionX = undefined;
        lastPathPositionY = undefined;
        walkie.triggerEvent('pathAccepted_', 'worldSingleClick.js', {
          pathArray: pathArray
        });
        return;
      }
    }

    if (!_.isEmpty(pathArray) && pathArray.length > 1) {
      lastPathPositionX = pathArray[pathArray.length - 1].x;
      lastPathPositionY = pathArray[pathArray.length - 1].y;
    } else {
      lastPathPositionX = undefined;
      lastPathPositionY = undefined;
    }

    if (!_.isEmpty(pathArray) && pathArray.length > 1) {
      walkie.triggerEvent('pathCalculated_', 'worldSingleClick.js', {
        pathArray: pathArray
      });
    } else {
      walkie.triggerEvent('pathImpossible_', 'worldSingleClick.js');
    }
  }
};
