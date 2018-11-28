// @format

'use strict';

const debug = require('debug')('cogs:library:generateSpriteUrlArray');
const fs = require('fs');

module.exports = (environment) => {
  return () => {
    const spriteFolderArray = ['sprite/hero', 'sprite,mapLayer'];
    const spriteUrlArray = [];

    (function init() {
      debug('init');
      compareState();
    })();

    // wszystko na _after  
    function scanSpriteFolderArray() {
      let path
      fs.readdir(spriteFolderArray[0], (error, files) {

      })
    }
  };
};
