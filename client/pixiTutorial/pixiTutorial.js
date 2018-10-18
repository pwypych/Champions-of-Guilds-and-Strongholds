// @format

'use strict';

/* pixiTutorial.js */
moduleContainer.pixiTutorial = () => {
  console.log('pixiTutorial');

  const options = {};
  options.width = 256;
  options.height = 256;
  options.backgroundColor = '0xff0000';
  const app = new PIXI.Application(options);
  document.body.appendChild(app.view);

  PIXI.loader.add('image/cat.png').load(setup);

  function setup() {
    const texture = PIXI.loader.resources['image/cat.png'].texture;
    const sprite = new PIXI.Sprite(texture);
    console.log('sprite', sprite);
  }
};
/* /pixiTutorial.js */
