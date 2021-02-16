// @format

'use strict';

// What does this module do?
// Draws random background in world state
g.autoload.worldBackgroundDraw = (inject) => {
  const viewport = inject.viewport;
  const walkie = inject.walkie;
  const auth = inject.auth;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const worldContainer = viewport.getChildByName('worldContainer');

  (function init() {
    onEntitiesGetFirst();
  })();

  function onEntitiesGetFirst() {
    walkie.onEvent(
      'viewportWorldReadyEvent_',
      'worldBackgroundDraw.js',
      () => {
        drawBackground();
      },
      false
    );
  }

  function drawBackground() {
    let backgroundContainer = worldContainer.getChildByName(
      'backgroundContainer'
    );

    if (!backgroundContainer) {
      backgroundContainer = new PIXI.Container();
      backgroundContainer.name = 'backgroundContainer';
      worldContainer.addChildZ(backgroundContainer, 1);
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
      const randomGenerator = new Math.seedrandom(auth.gameId);
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
  }
};
