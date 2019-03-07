// @format

'use strict';

g.setup.setupImages = (auth, callback) => {
  (function init() {
    getSpriteFilenameArray();
  })();

  // spriteFilenameArray = [
  //   'castleRandom.png',
  //   'dirt.png',
  //   'rock.png',
  //   ...
  // ];

  function getSpriteFilenameArray() {
    $.get(
      '/ajax/world/load/spriteFilenameArray' + auth.uri,
      (spriteFilenameArray) => {
        forEachSpriteFilename(spriteFilenameArray);
      }
    );
  }

  function forEachSpriteFilename(spriteFilenameArray) {
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
