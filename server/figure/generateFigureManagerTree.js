// @format

'use strict';

const debug = require('debug')('cogs:generateFigureManagerTree');
const fs = require('fs');

// figureManagerTree is an object that has all figureManager's
// figureManager is a manager for given figure
// figure is a generic representation of a figureInstance on game map
// figureInstance is a data object in mapLayer in mongo gameCollection
// figureManager is used to do stuff on figureInstance's
// we can also use figureManager to produce figureInstance's
// figureManager for given figure resides in the server/figure/[figureName] folder
module.exports = (environment) => {
  return (callback) => {
    const figureManagerTree = {};

    (function init() {
      debug('init');
      scanBasepathFigureFolder();
    })();

    function scanBasepathFigureFolder() {
      fs.readdir(environment.basepathFigure, (error, folderNameArray) => {
        // debug('scanBasepathFigureFolder: folderNameArray:', folderNameArray);
        forEachFolderName(folderNameArray);
      });
    }

    function forEachFolderName(folderNameArray) {
      folderNameArray.forEach((folderName) => {
        if (folderName !== 'generateFigureManagerTree.js') {
          // debug('forEachFolderName', folderName);
          requireFigure(folderName);
        }
      });

      callback(null, figureManagerTree);
    }

    /* eslint-disable import/no-dynamic-require */
    /* eslint-disable global-require */
    function requireFigure(folderName) {
      figureManagerTree[
        folderName
      ] = require(`./${folderName}/${folderName}.js`)();
    }
    /* eslint-enable import/no-dynamic-require */
    /* eslint-enable global-require */
  };
};
