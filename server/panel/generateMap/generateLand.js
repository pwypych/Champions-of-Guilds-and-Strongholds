// @format

'use strict';

const debug = require('debug')('cogs:generateLand');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Generate land object with its configuration settings');

      generateLand();
    })();

    function generateLand() {
      const land = {};
      land.name = 'nazwa';
      land.width = 5;
      land.height = 5;
      land.players = 2;
      land.parcelLevelMap = [
        [0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 0]
      ];
      land.mazeMap = [
        ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'],
        ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'],
        ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'],
        ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx'],
        ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx']
      ];

      debug('generateLand: land:', land);
      res.locals.land = land;
      next();
    }
  };
};
