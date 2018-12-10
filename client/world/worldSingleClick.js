// @format

'use strict';

g.world.worldSingleClick = (walkie, auth, viewport) => {
  let stateData;

  let heroX;
  let heroY;

  let clickX;
  let clickY;

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

    if (!_.isEmpty(pathArray) && pathArray.length > 1) {
      walkie.triggerEvent('pathCalculated_', 'worldSingleClick.js', {
        pathArray: pathArray
      });
    } else {
      walkie.triggerEvent('pathImpossible_', 'worldSingleClick.js');
    }
  }
};
