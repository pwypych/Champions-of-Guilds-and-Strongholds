// @format

'use strict';

const debug = require('debug')('cogs:zeroPlayerMovementPoints.js');

// What does this module do?
// Middleware that update hero.movementStats.movement to 0
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('init');
      updatePlayerEntityEndTurn();
    })();
  };
};
