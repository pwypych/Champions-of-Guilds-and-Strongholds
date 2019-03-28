// @format

'use strict';

g.battle.backgroundDraw = (walkie, viewport) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'viewportBattleReady_',
      'backgroundDraw.js',
      () => {
        drawBackground();
      },
      false
    );
  }

  function drawBackground() {
    let backgroundContainer = battleContainer.getChildByName(
      'backgroundContainer'
    );

    if (!backgroundContainer) {
      backgroundContainer = new PIXI.Container();
      backgroundContainer.name = 'backgroundContainer';
      battleContainer.addChildZ(backgroundContainer, 1);
    }

    if (backgroundContainer.children.length < 1) {
      const width = viewport.worldWidth / blockWidthPx;
      const height = viewport.worldHeight / blockHeightPx;

      _.times(width, (x) => {
        _.times(height, (y) => {
          let textureName = 'backgroundGrass1';
          if (_.random(1, 3) === 3) {
            textureName = 'backgroundGrass' + _.random(2, 17);
          }

          const texture = PIXI.loader.resources[textureName].texture;
          const background = new PIXI.Sprite(texture);
          background.name = 'background' + x + '_' + y;
          background.x = x * blockWidthPx;
          background.y = y * blockHeightPx;
          backgroundContainer.addChild(background);
        });
      });
    }

    drawGrid();
  }

  function drawGrid() {
    const width = viewport.worldWidth / blockWidthPx;
    const height = viewport.worldHeight / blockHeightPx;

    _.times(width, (index) => {
      if (index === 0) {
        return;
      }

      const name = 'battle_grid_line_horizontal_' + index;
      let line;

      if (battleContainer.getChildByName(name)) {
        line = battleContainer.getChildByName(name);
      }

      if (!battleContainer.getChildByName(name)) {
        // console.log('drawGrid:horizontal_line', name);
        line = new PIXI.Graphics();
        line.name = name;
        line.lineStyle(1, 0x777777, 0.5);
        const fromX = index * blockWidthPx;
        const fromY = 0;
        const toX = index * blockWidthPx;
        const toY = viewport.worldHeight;
        line.moveTo(fromX, fromY).lineTo(toX, toY);
        const zOrder = 2;
        battleContainer.addChildZ(line, zOrder);
      }
    });

    _.times(height, (index) => {
      if (index === 0) {
        return;
      }

      const name = 'battle_grid_line_vertical_' + index;
      let line;

      if (battleContainer.getChildByName(name)) {
        line = battleContainer.getChildByName(name);
      }

      if (!battleContainer.getChildByName(name)) {
        // console.log('drawGrid:vertical_line', name);
        line = new PIXI.Graphics();
        line.name = name;
        line.lineStyle(1, 0x777777, 0.5);
        const fromX = 0;
        const fromY = index * blockHeightPx;
        const toX = viewport.worldWidth;
        const toY = index * blockHeightPx;
        line.moveTo(fromX, fromY).lineTo(toX, toY);
        const zOrder = 2;
        battleContainer.addChildZ(line, zOrder);
      }
    });
  }
};
