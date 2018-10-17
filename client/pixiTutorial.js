'use strict';

/* pixiTutorial.js */
(function init(document, $, _, pixi, moduleArray) {

  const options = {};
  options.width = 256;
  options.height = 256;
  options.backgroundColor = '0xff0000';
  const app = new pixi.Application(options);
  document.body.appendChild(app.view);

})(document, $, _, PIXI, moduleArray);
/* /pixiTutorial.js */
