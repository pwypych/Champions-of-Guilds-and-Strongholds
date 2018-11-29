// @format

'use strict';

g.world.initImages = (callback) => {
  const spriteFilenameArray = [
    'castleRandom.png',
    'dirt.png',
    'rock.png',
    'tree.png',
    'empty.png',
    'heroHuman.png'
  ];

  spriteFilenameArray.forEach((spriteFilename) => {
    const uri = '/sprite/' + spriteFilename;
    const name = spriteFilename.substr(0, spriteFilename.length - 4);
    console.log('initImages:', name, uri);
    PIXI.loader.add(name, uri);
  });

  PIXI.loader.load(() => {
    callback();
  });
};
