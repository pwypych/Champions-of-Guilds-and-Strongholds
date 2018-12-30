// @format

'use strict';

const debug = require('debug')('cogs:unsetEndTurnFlags.js');
const _ = require('lodash');

// What does this module do?
// Middleware, unset endTurnCountdownRunning and players endTurn flags
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('init');
      generateHeroArray();
    })();
  };
};
