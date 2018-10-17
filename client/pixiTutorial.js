'use strict';

/* pixiTutorial.js */

let type = 'WebGL';
if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas';
}

PIXI.utils.sayHello(type);

/* /pixiTutorial.js */
