// @format

'use strict';

const debug = require('debug')('cogs:generateFigureManagerTree');

// figureManagerTree is an object that has all figureManager's
// figureManager is a manager for given figure
// figure is a generic representation of a figureInstance on gameInstance map
// figureInstance is a data object in mapLayer in mongo gameInstanceCollection
// figureManager is used to do stuff on figureInstance's
// we can also use figureManager to produce figureInstance's
// figureManager for given figure resides in the server/figure/[figureName] folder
module.exports = () => {
  return (callback) => {
    const figureManagerTree = {};

    (function init() {
      debug('init');
    })();

    // load all figures from folder

    // require them

    // put into figureManagerTree (object)

    // return it through callback
  };
};
