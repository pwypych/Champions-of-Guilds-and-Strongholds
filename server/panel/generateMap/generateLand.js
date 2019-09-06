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
      land.players = 2;
      land.levelMap = [
        [0, 1, 4, 1, 1],
        [1, 2, 5, 1, 1],
        [4, 5, 5, 5, 4],
        [1, 1, 5, 2, 1],
        [1, 1, 4, 1, 0]
      ];
      land.mazeMap = [
        ['oooo', 'oooo', 'ooox', 'oooo', 'oooo'],
        ['oooo', 'oooo', 'ooox', 'oooo', 'oooo'],
        ['ooxo', 'ooxo', 'oooo', 'xooo', 'xooo'],
        ['oooo', 'oooo', 'oxoo', 'oooo', 'oooo'],
        ['oooo', 'oooo', 'oxoo', 'oooo', 'oooo']
      ];

      debug('generateLand: land:', land);
      res.locals.land = land;
      // next();
    }
  };
};
