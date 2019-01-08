// @format

'use strict';

const debug = require('debug')('cogs:checkUnitOwnerComponent');

// What does this module do?
// Middleware, compare unit owner component with playerId
module.exports = () => {
  return (req, res, next) => {
    (function init() {
      const entities = res.locals.entities;
      const playerId = res.locals.playerId;
      const unit = entities[res.locals.unitId];

      debug('init: playerId:', playerId);
      debug('init: unit:', unit);
      checkUnitOwnerComponent(unit, playerId);
    })();

    function checkUnitOwnerComponent(unit, playerId) {
      if (unit.owner !== playerId) {
        debug(
          'checkUnitOwnerComponent: owner and playerId are different, unit.owner:',
          unit.owner,
          'playerId',
          playerId
        );
        return;
      }

      debug('checkUnitOwnerComponent: unit.owner:', unit.owner);
      next();
    }
  };
};
