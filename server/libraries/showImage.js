// @format

'use strict';

const debug = require('debug')('cogs:showImage');
const validator = require('validator');
const fs = require('fs');

module.exports = (environment) => {
  return (req, res) => {
    (function init() {
      debug('init');
      sanitizeImageName();
    })();

    function sanitizeImageName() {
      const imageNameDirty = req.params.imageName;
      const imageNameClean = validator.whitelist(
        imageNameDirty,
        'abcdefghijklmnopqrstuvwxyz01234567890'
      );

      debug('sanitizeImageName: imageNameClean:', imageNameClean);
      scanImageFile(imageNameClean);
    }

    function scanImageFile(imageName) {
      const imageFilePath =
        environment.basepathFigure + '/' + imageName + '/' + imageName + '.png';
      debug('imageFilePath', imageFilePath);

      fs.stat(imageFilePath, (error, stats) => {
        if (error) {
          debug('Error: ', error.message);
          return;
        }

        debug('scanImageFile: stats.size', stats.size);
        readImage(imageFilePath);
      });
    }

    function readImage(imageFilePath) {
      fs.readFile(imageFilePath, (error, data) => {
        if (error) {
          debug('Error: ', error.message);
          return;
        }
        sendResponse(data);
      });
    }

    function sendResponse(data) {
      res.setHeader('Content-Type', 'image/png');
      res.end(data); // Send the file data to the browser.
      debug('******************** send ********************');
    }
  };
};
