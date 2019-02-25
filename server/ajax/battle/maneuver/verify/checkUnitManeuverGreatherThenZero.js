// @format

'use strict';

const debug = require('debug')('cogs:checkUnitManeuverGreatherThenZero');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Checks if unit have any maneuvers left');
      const entities = res.locals.entities;
      const entityId = res.locals.entityId;

      checkUnitManeuver(entities, entityId);
    })();

    function checkUnitManeuver(entities, entityId) {
      const unit = entities[entityId];
      if (unit.unitStats.current.maneuver < 1) {
        debug(
          'checkUnitManeuver: No maneuvers remaining! - unit.unitStats.current.maneuver:',
          unit.unitStats.current.maneuver
        );
        return;
      }

      debug(
        'checkUnitManeuver: Maneuvers remaining:',
        unit.unitStats.current.maneuver
      );
      next();
    }
  };
};
