// @format

'use strict';

const debug = require('debug')('cogs:checkUnitManeuverGreatherThenZero');

// What does this module do?
// Middleware, checks if unit have any maneuvers left
module.exports = () => {
  return (req, res, next) => {
    (function init() {
      const entities = res.locals.entities;
      const unit = entities[res.locals.unitId];

      debug('init: unitId:', res.locals.unitId);
      checkUnitManeuverLeft(unit);
    })();

    function checkUnitManeuverLeft(unit) {
      if (unit.unitStats.current.maneuver < 1) {
        debug(
          'checkUnitManeuverLeft: No maneuver! - unit.unitStats.current.maneuver:',
          unit.unitStats.current.maneuver
        );
        return;
      }

      debug(
        'checkUnitManeuverLeft: unit.unitStats.current.maneuver:',
        unit.unitStats.current.maneuver
      );
      next();
    }
  };
};
