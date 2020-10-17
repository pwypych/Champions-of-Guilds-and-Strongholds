// @format

'use strict';

// What does this module do?
// Sets up PIXI viewport with options and basic containers
g.setup.setupViewport = (app) => {
  const options = {};
  options.screenWidth = window.innerWidth;
  options.screenHeight = window.innerHeight;

  const viewport = new PIXI.extras.Viewport(options);

  // console.log(viewport);

  app.stage.addChild(viewport);

  // activate plugins
  viewport.drag({ clampWheel: true });
  viewport.pinch();
  viewport.wheel();
  viewport.decelerate();
  const pixelRatio = window.devicePixelRatio;
  viewport.zoomPercent(1 / pixelRatio);

  // align screen to have a little margin
  // viewport.moveCorner(-32, -32);

  // viewport.on('clicked', (e) =>
  //   console.log('clicked (' + e.world.x + ',' + e.world.y + ')')
  // );

  // add containers for different scenes
  const worldContainer = new PIXI.ContainerZ();
  worldContainer.name = 'worldContainer';
  viewport.addChild(worldContainer);

  const battleContainer = new PIXI.ContainerZ();
  battleContainer.name = 'battleContainer';
  viewport.addChild(battleContainer);

  // sortChildrend and ContainerZ comes from pixi-simple-insertion-sort.js library
  // we should sortChildren() on every tick as it checks for changes first
  app.ticker.add(() => {
    battleContainer.sortChildren();
    worldContainer.sortChildren();
  });

  return viewport;
};
