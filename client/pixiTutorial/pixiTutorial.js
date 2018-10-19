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

    const rectangle = new PIXI.Rectangle(32, 32, 32, 32);

    texture.frame = rectangle;

    const catSprite = new PIXI.Sprite(texture);
    console.log('catSprite', catSprite);
    displaySprites(catSprite);
  }

  function displaySprites(catSprite) {
    catSprite.x = 128;
    catSprite.y = 128;

    catSprite.width = 80;
    catSprite.height = 120;

    catSprite.scale.x = 2;
    catSprite.scale.y = 2;

    catSprite.anchor.x = 0.5;
    catSprite.anchor.y = 0.5;

    catSprite.rotation = 0.5;

    app.stage.addChild(catSprite);

    app.ticker.add((dt) => {
      gameLoop(dt, catSprite);
    });
  }

  function gameLoop(dt, catSprite) {
    catSprite.rotation += 0.05 * dt;
  }
};
/* /pixiTutorial.js */
