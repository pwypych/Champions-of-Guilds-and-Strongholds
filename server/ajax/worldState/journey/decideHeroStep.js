// @format

'use strict';

const debug = require('debug')('cogs:decideHeroStep');

// What does this module do?
// Change hero position
module.exports = (db) => {
  return (gameId, heroId, position, callback) => {
    (function init() {
      debug('init');

      updateHeroPosition();
    })();
  };
};
