// @format

'use strict';

const debug = require('debug')('cogs:spriteFilenameArrayGet');
const fs = require('fs');

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
        debug('spriteNameExtension', spriteNameExtension);

        if (spriteNameExtension !== 'png') {
          debug('spriteFileName - false', spriteFileName);
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
