// @format

'use strict';

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

  // align screen to have a little margin
  viewport.moveCorner(-32, -32);

  // viewport.on('clicked', (e) =>
  //   console.log('clicked (' + e.world.x + ',' + e.world.y + ')')
  // );

  return viewport;
};
