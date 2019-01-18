// @format

'use strict';

const debug = require('debug')('cogs:checkUnitOwner');

// What does this module do?
// Middleware, check if player sending request is owner of unit
module.exports = () => {
  return (req, res, next) => {
    (function init() {
      const entities = res.locals.entities;
      const playerId = res.locals.playerId;
      const unit = entities[res.locals.unitId];

      debug('init: playerId:', playerId);
      debug('init: unitId:', res.locals.unitId);
      checkUnitOwner(unit, playerId);
    })();

    function checkUnitOwner(unit, playerId) {
      if (unit.owner !== playerId) {
        debug(
          'checkUnitOwner: owner and playerId are different, unit.owner:',
          unit.owner,
          'playerId',
          playerId
        );
        return;
      }

      debug('checkUnitOwner: Yes!');
      next();
    }
  };
};
