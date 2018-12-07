// @format

'use strict';

g.world.initPixi = ($body) => {
  const $canvas = $('<canvas id="pixi-canvas"></canvas>');
  const eCanvas = $canvas.get(0);

  $body.find('#js-world').append($canvas);

  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

  const options = {};
  options.width = window.innerWidth;
  options.height = window.innerHeight;
  options.resolution = 2; // double pixel ratio
  options.forceCanvas = true;
  options.view = eCanvas;

  const app = new PIXI.Application(options);

  return app;
};
