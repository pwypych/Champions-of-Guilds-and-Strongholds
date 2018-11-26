// @format

'use strict';

g.world.pixiInit = (walkie, $body, auth) => {
  let app;
  let viewport;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  let mapLayer;

  (function init() {
    onStateChange();
  })();

  function onStateChange() {
    walkie.onEvent('stateChange_', 'worldToggle.js', (state) => {
      if (state === 'worldState') {
        ajaxReadMapLayer();
      }
    });
  }

  function ajaxReadMapLayer() {
    console.log();
    $.get('/ajax/stateDataGet' + auth.uri, (data) => {
      console.log('GET api/stateDataGet', data);
      mapLayer = data.mapLayer;
      instantiatePixiApp();
    });
  }

  function instantiatePixiApp() {
    const $canvas = $('<canvas id="pixi-canvas"></canvas>');
    const eCanvas = $canvas.get(0);

    const $world = $body.find('#js-world');
    $world.empty();
    $world.append($canvas);

    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    const options = {};
    options.width = window.innerWidth;
    options.height = window.innerHeight;
    options.resolution = 2; // double pixel ratio
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

    // align screen to have a little margin
    viewport.moveCorner(-32, -32);

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
      drawBackground();
    });
  }

  function drawBackground() {
    const background = new PIXI.Graphics();
    const color = 0xc7c7c7;
    background.beginFill(color);
    const x = 0;
    const y = 0;
    const width = viewport.worldWidth;
    const height = viewport.worldHeight;
    background.drawRect(x, y, width, height);

    viewport.addChild(background);

    forEachFigure();
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
