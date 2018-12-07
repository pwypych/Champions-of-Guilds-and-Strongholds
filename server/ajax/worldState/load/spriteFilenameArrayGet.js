// @format

'use strict';

const debug = require('debug')('cogs:spriteFilenameArrayGet');
const fs = require('fs');

// What does this module do?
// Send array with every sprite filename
module.exports = (environment) => {
  return (req, res) => {
    const spriteFolder = environment.basepath + '/public/sprite';

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

        debug('spriteFileName - true', spriteFileName);
        return true;
      });

      sendStateData(spriteFilenameArray);
    }

    function sendStateData(spriteFilenameArray) {
      debug('sendStateData');
      res.send(spriteFilenameArray);
      debug('******************** ajax ********************');
    }
  };
};
