// @format

'use strict';

const debug = require('debug')('cogs:library:generateSpriteUrlArray');
const fs = require('fs');

module.exports = (environment) => {
  return () => {
    const spriteFolder = environment.basepath + '/public/sprite';
    let spriteFilenameArray;

    (function init() {
      debug('init');
      scanSpriteFolder();
    })();

    function scanSpriteFolder() {
      fs.readdir(spriteFolder, (error, files) => {
        if (error) {
          debug('Cannot read file');
          return;
        }

        debug('scanSpriteFolder', files);
        afterForEachSpriteFolder();
      });
    }

    function isEvery(files) {}

    function afterForEachSpriteFolder() {
      debug(
        'afterForEachSpriteFolder: spriteFilenameArray:',
        spriteFilenameArray
      );
    }
  };
};
