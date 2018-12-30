// @format

'use strict';

const debug = require('debug')('cogs:endTurnCountdown.js');

// What does this module do?
// Middleware, check endTurnCountdownRunning flag, countdown 10s and end each player turn
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('init');
      updatePlayerEntityEndTurn();
    })();
  };
};
