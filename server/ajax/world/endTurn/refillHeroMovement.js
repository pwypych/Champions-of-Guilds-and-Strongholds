// @format

'use strict';

const debug = require('debug')('cogs:refillHeroMovement.js');

// What does this module do?
// Middleware, set hero.movement to hero.movementMax
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('init');
      checkEndTurnCountdownFlag();
    })();
  };
};
