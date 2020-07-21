// @format

'use strict';

const debug = require('debug')('cogs:setupSpriteFilenameArray');
const fs = require('fs');

// What does this module do?
// It scans sprite directory, and generates array of all .png filenames
module.exports = (environment, callback) => {
  const spriteFolder = environment.basepath + '/public/sprite';

  (function init() {
    scanSpriteFolder();
  })();

  function scanSpriteFolder() {
    fs.readdir(spriteFolder, (error, files) => {
      if (error) {
        debug('Cannot read file');
        return;
      }

      // debug('scanSpriteFolder: files.length', files.length);
      checkIsEverySpriteFilePng(files);
    });
  }

  function checkIsEverySpriteFilePng(files) {
    const spriteFilenameArray = files.filter((spriteFileName) => {
      const spriteNameExtension = spriteFileName.substring(
        spriteFileName.length - 3,
        spriteFileName.length
      );

      if (spriteNameExtension !== 'png') {
        return false;
      }

      // debug('spriteFileName - true', spriteFileName);
      return true;
    });

    callback(null, spriteFilenameArray);
  }
};
