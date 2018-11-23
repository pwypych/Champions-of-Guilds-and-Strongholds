// @format

'use strict';

g.world.pixiInit = ($body, auth) => {
  let app;
  let viewport;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  let mapLayer;

  (function init() {
    ajaxReadMapLayer();
  })();

  function ajaxReadMapLayer() {
    console.log();
    $.get('/ajax/stateDataGet' + auth.uri, (data) => {
      console.log('GET api/stateDataGet', data);
      // mapLayer = data.mapLayer;
      // instantiatePixiApp();
    });
  }

  function instantiatePixiApp() {
    const eCanvas = $body.find('#pixi-canvas').get(0);

    const options = {};
    options.width = window.innerWidth;
    options.height = window.innerHeight;
    options.resolution = window.devicePixelRatio; // So retina (double pixel displays works correctly)
    options.view = eCanvas;

    app = new PIXI.Application(options);

    instantiateViewport();
  }

  function instantiateViewport() {
    const options = {};
    options.screenWidth = window.innerWidth;
    options.screenHeight = window.innerHeight;
    options.worldWidth = mapLayer[0].length * blockWidthPx;
    options.worldHeight = mapLayer.length * blockHeightPx;

    viewport = new PIXI.extras.Viewport(options);

    // console.log(viewport);

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
    // find all figure names
    const figureNameArray = [];
    mapLayer.forEach((row) => {
      row.forEach((figure) => {
        figureNameArray.push(figure.name);
      });
    });

    // only unique names
    const figureNameUniqueArray = _.uniq(figureNameArray);

    console.log('figureNameUniqueArray', figureNameUniqueArray);

    figureNameUniqueArray.forEach((figureName) => {
      PIXI.loader.add(figureName, `/image/figure/${figureName}.png`);
    });

    // start loading images
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
