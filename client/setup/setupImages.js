// @format

'use strict';

g.setup.setupImages = (spriteFilenameArray, callback) => {
  (function init() {
    forEachSpriteFilename();
  })();

  // spriteFilenameArray = [
  //   'castleRandom.png',
  //   'dirt.png',
  //   'rock.png',
  //   ...
  // ];

  function forEachSpriteFilename() {
    let message = '';
    spriteFilenameArray.forEach((spriteFilename) => {
      const uri = '/sprite/' + spriteFilename + '?t=' + Date.now();
      const name = spriteFilename.substr(0, spriteFilename.length - 4);
      PIXI.loader.add(name, uri);
      message += name + ' ';
    });

    console.log('setupImages.js:', message);

    loadSprites();
  }

  function loadSprites() {
    PIXI.loader.load(() => {
      callback();
    });
  }
};
