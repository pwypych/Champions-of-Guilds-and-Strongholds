// @format

'use strict';

// What does this module do?
// Sets up PIXI app with canvas and some options
g.setup.setupPixi = ($body) => {
  const $canvas = $('<canvas id="pixi-canvas"></canvas>');
  const eCanvas = $canvas.get(0);

  $body.find('[data-canvas-wrapper]').append($canvas);

  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

  const options = {};
  options.width = window.innerWidth;
  options.height = window.innerHeight;
  options.resolution = 1; // double pixel ratio
  options.forceCanvas = true;
  options.view = eCanvas;

  const app = new PIXI.Application(options);

  return app;
};
