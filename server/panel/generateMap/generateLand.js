// @format

'use strict';

const debug = require('debug')('cogs:generateLand');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Generate land object filled with abstractParcels');

      generateLand();
    })();

    function generateLand() {
      const land = {};
      land.name = 'nazwa';
      land.width = 5;
      land.height = 5;
      land.players = 2;

      debug('generateLand: land:', land);
      res.locals.land = land;
      next();
    }
  };
};
