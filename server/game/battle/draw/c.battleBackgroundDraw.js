// @format

'use strict';

// What does this module do?
// Draws random background and grid in battle state
g.autoload.battleBackgroundDraw = (inject) => {
  const viewport = inject.viewport;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'viewportBattleReady_',
      'battleBackgroundDraw.js',
      () => {
        findBattleEntity();
      },
      false
    );
  }

  function findBattleEntity() {
    let battleId;
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.attackerId && entity.defenderId) {
        battleId = id;
      }
    });

    drawBackground(battleId);
  }

  function drawBackground(battleId) {
    let backgroundContainer = battleContainer.getChildByName(
      'backgroundContainer'
    );

    if (!backgroundContainer) {
      backgroundContainer = new PIXI.Container();
      backgroundContainer.name = 'backgroundContainer';
      battleContainer.addChildZ(backgroundContainer, 1);
    }

    if (backgroundContainer.children.length < 1) {
      const background = new PIXI.Graphics();
      background.name = 'backgroundWhite';
      const color = 0xffffff;
      background.beginFill(color);
      const backgroundX = 0;
      const backgroundY = 0;
      const backgroundWidth = viewport.worldWidth;
      const backgroundHeight = viewport.worldHeight;
      background.drawRect(
        backgroundX,
        backgroundY,
        backgroundWidth,
        backgroundHeight
      );
      backgroundContainer.addChild(background);

      const width = viewport.worldWidth / blockWidthPx;
      const height = viewport.worldHeight / blockHeightPx;

      /* eslint-disable new-cap */
      const randomGenerator = new Math.seedrandom(battleId);
      /* eslint-enable new-cap */

      _.times(width, (x) => {
        _.times(height, (y) => {
          let textureName = 'backgroundGrass1';

          const random1to3 = Math.floor(randomGenerator() * 3) + 1;
          if (random1to3 === 3) {
            const random2to17 = Math.floor(randomGenerator() * 17) + 1;
            textureName = 'backgroundGrass' + random2to17;
          }

          const texture = PIXI.loader.resources[textureName].texture;
          const backgroundTile = new PIXI.Sprite(texture);
          backgroundTile.name = 'backgroundTile' + x + '_' + y;
          backgroundTile.x = x * blockWidthPx;
          backgroundTile.y = y * blockHeightPx;
          backgroundTile.alpha = 0.9;
          backgroundContainer.addChild(backgroundTile);
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
