// @format

'use strict';

/* pixiTest.js */
moduleContainer.pixiTest = () => {
  const gameInstanceId = $.url('?gameInstanceId');
  const playerToken = $.url('?playerToken');

  let app;
  let viewport;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  // prettier-ignore
  let mapLayer;

  (function init() {
    console.log('init');
    ajaxReadMapLayer();
  })();

  function ajaxReadMapLayer() {
    console.log();
    $.get(
      `/ajax/readMap?gameInstanceId=${gameInstanceId}&playerToken=${playerToken}`,
      (data) => {
        console.log('GET api/readMap', data);
        mapLayer = data;
        instantiatePixiApp();
      }
    );
  }

  function instantiatePixiApp() {
    const options = {};
    options.width = window.innerWidth;
    options.height = window.innerHeight;
    options.resolution = window.devicePixelRatio; // So retina (double pixel displays works correctly)

    app = new PIXI.Application(options);

    document.body.appendChild(app.view);

    instantiateViewport();
  }

  function instantiateViewport() {
    const options = {};
    options.screenWidth = window.innerWidth;
    options.screenHeight = window.innerHeight;
    options.worldWidth = mapLayer[0].length * blockWidthPx;
    options.worldHeight = mapLayer.length * blockHeightPx;
    // options.interaction = app.renderer.interaction;

    viewport = new PIXI.extras.Viewport(options);

    console.log(viewport);

    app.stage.addChild(viewport);

    // activate plugins
    viewport.drag({ clampWheel: true });
    viewport.pinch();
    viewport.wheel();
    viewport.decelerate();

    // viewport.on('clicked', (e) =>
    //   console.log('clicked (' + e.world.x + ',' + e.world.y + ')')
    // );

    loadImages();
  }

  function loadImages() {
    PIXI.loader.add('rock', '/image/figure/3.png');
    PIXI.loader.add('dirt', '/image/figure/2.png');
    PIXI.loader.add('tree', '/image/figure/7.png');
    PIXI.loader.load(() => {
      forEachFigure();
    });
  }

  function forEachFigure() {
    mapLayer.forEach((row, y) => {
      row.forEach((figure, x) => {
        instantiateSprites(figure.name, x, y);
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

    viewport.addChild(sprite);
  }
};
/* /pixiTest.js */
