// @format

'use strict';

/* pixiTutorial.js */
moduleContainer.pixiTutorial = () => {
  let app;

  (function init() {
    console.log('init');
    instantiatePixiApp();
  })();

  function instantiatePixiApp() {
    const options = {};
    options.width = 256;
    options.height = 256;
    app = new PIXI.Application(options);
    appendToBody();
  }

  function appendToBody() {
    document.body.appendChild(app.view);
    loadImages();
  }

  function loadImages() {
    PIXI.loader.add('/image/cat.png');
    PIXI.loader.load(() => {
      instantiateSprites();
    });
  }

  function instantiateSprites() {
    const texture = PIXI.loader.resources['/image/cat.png'].texture;
    const sprite = new PIXI.Sprite(texture);
    console.log('sprite', sprite);
    displaySprites(sprite);
  }

  function displaySprites(sprite) {
    app.stage.addChild(sprite);
  }
};
/* /pixiTutorial.js */
