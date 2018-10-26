// @format

'use strict';

/* pixiTest.js */
moduleContainer.pixiTest = () => {
  let app;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  // prettier-ignore
  const mapLayer = [[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],[3,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2,2,2,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,2,0,3],[3,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,3,0,3,0,0,0,0,0,2,0,0,0,0,0,0,0,7,0,0,0,0,0,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],[3,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],[3,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,7,7,7,0,0,0,0,0,0,3,0,3],[3,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,7,7,7,0,0,0,0,0,2,0,2,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,7,0,0,0,2,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,0,7,0,0,0,0,7,7,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,7,0,0,0,7,7,0,0,0,0,2,2,0,0,0,0,0,0,2,0,0,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,2,2,0,0,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,2,2,0,0,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,2,0,0,0,0,0,2,2,0,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,2,0,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0],[3,0,0,0,3,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,2,3],[3,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,2,0,0,0,0,2,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,2,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3],[3,0,0,0,0,0,0,0,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],[3,0,0,0,0,0,0,0,0,7,0,0,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]];

  (function init() {
    console.log('init');
    instantiatePixiApp();
  })();

  function instantiatePixiApp() {
    const options = {};
    options.width = 500;
    options.height = 500;
    options.resolution = window.devicePixelRatio; // So retina (double pixel displays works correctly)

    app = new PIXI.Application(options);

    document.body.appendChild(app.view);

    instantiateViewport();
  }

  function instantiateViewport() {
    const options = {};
    options.screenWidth = 500;
    options.screenHeight = 500;
    options.worldWidth = 2000;
    options.worldHeight = 2000;
    options.interaction = app.renderer.interaction;

    const viewport = new PIXI.extras.Viewport(options);

    console.log(viewport);

    app.stage.addChild(viewport);

    // activate plugins
    viewport.drag({ clampWheel: true });
    viewport.pinch();
    viewport.wheel();
    viewport.decelerate();

    viewport.on('clicked', (e) =>
      console.log('clicked (' + e.world.x + ',' + e.world.y + ')')
    );

    loadImages();
  }

  function loadImages() {
    PIXI.loader.add('block', '/image/figure/3.png');
    PIXI.loader.add('dirt', '/image/figure/2.png');
    PIXI.loader.add('tree', '/image/figure/7.png');
    PIXI.loader.load(() => {
      forEachFigure();
    });
  }

  function forEachFigure() {
    mapLayer.forEach((row, y) => {
      row.forEach((figureId, x) => {
        let figureName = 'empty';

        if (figureId === 3) {
          figureName = 'block';
        }

        if (figureId === 2) {
          figureName = 'dirt';
        }

        if (figureId === 7) {
          figureName = 'tree';
        }

        instantiateSprites(figureName, x, y);
      });
    });
  }

  function instantiateSprites(figureName, x, y) {
    if (figureName === 'empty') {
      return;
    }

    const texture = PIXI.loader.resources[figureName].texture;
    const sprite = new PIXI.Sprite(texture);

    sprite.width = blockWidthPx;
    sprite.height = blockHeightPx;

    sprite.x = x * blockWidthPx;
    sprite.y = y * blockHeightPx;

    app.stage.addChild(sprite);
  }
};
/* /pixiTest.js */
