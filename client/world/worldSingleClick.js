// @format

'use strict';

// What does this module do?
// It listens to mouse click events, generates path through library and sends path events
g.world.worldSingleClick = (walkie, auth, viewport) => {
  let stateData;

  let heroX;
  let heroY;

  let clickX;
  let clickY;

  let lastPathPositionX;
  let lastPathPositionY;

  (function init() {
    onStateDataGet();
    onStateChange();
  })();

  function onStateDataGet() {
    walkie.onEvent(
      'stateDataGet_',
      'worldSingleClick.js',
      (data) => {
        if (data.state === 'worldState') {
          stateData = data;
          findHeroYX();
        }
      },
      false
    );
  }

  function findHeroYX() {
    const playerArray = stateData.playerArray;
    const playerIndex = stateData.playerIndex;

    heroX = parseInt(playerArray[playerIndex].hero.x, 10);
    heroY = parseInt(playerArray[playerIndex].hero.y, 10);
  }

  function onStateChange() {
    walkie.onEvent('stateChange_', 'worldSingleClick.js', (state) => {
      if (state === 'worldState') {
        addListener();
      } else {
        removeListener();
      }
    });
  }

  function removeListener() {
    viewport.removeListener('clicked');
  }

  function addListener() {
    viewport.on('clicked', (event) => {
      clickX = Math.floor(event.world.x / 32);
      clickY = Math.floor(event.world.y / 32);
      generatePathGrid();
    });
  }

  function generatePathGrid() {
    const width = stateData.mapLayer[0].length;
    const height = stateData.mapLayer.length;

    const grid = new PF.Grid(width, height);

    stateData.mapLayer.forEach((row, y) => {
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

    triggerEvents(pathArray);
  }

  function triggerEvents(pathArray) {
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
