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
      const spriteFilenameArray = [];
      files.forEach((spriteName) => {
        const spriteNameExtension = spriteName.substring(
          spriteName.length - 3,
          spriteName.length
        );
        if (spriteNameExtension === 'png') {
          spriteFilenameArray.push(spriteName);
        }
        debug('spriteName', spriteName);
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
