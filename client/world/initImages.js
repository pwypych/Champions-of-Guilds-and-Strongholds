// @format

'use strict';

g.world.initImages = (auth, callback) => {
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
    spriteFilenameArray.forEach((spriteFilename) => {
      const uri = '/sprite/' + spriteFilename;
      const name = spriteFilename.substr(0, spriteFilename.length - 4);
      console.log('initImages.js:', name, uri);
      PIXI.loader.add(name, uri);
    });

    loadSprites();
  }

  function loadSprites() {
    PIXI.loader.load(() => {
      callback();
    });
  }
};
