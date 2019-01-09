// @format

'use strict';

const debug = require('debug')('cogs:nominateActiveUnit');

// What does this module do?
// Middleware, nominate unit that will start next battle round
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      const gameId = res.locals.gameId;
      const unitId = res.locals.unitId;

      debug('init: gameId:', gameId);
      debug('init: unitId:', unitId);
      updateUnitManeuver(gameId, unitId);
    })();
  };
};
