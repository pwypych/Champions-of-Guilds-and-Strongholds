// @format

'use strict';

const debug = require('debug')('cogs:checkUnitManeuverGreatherThenZero');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Checks if unit have any maneuverPoints left');
      const entities = res.locals.entities;
      const entityId = res.locals.entityId;

      checkUnitManeuverPoints(entities, entityId);
    })();

    function checkUnitManeuverPoints(entities, entityId) {
      const unit = entities[entityId];
      if (unit.unitStats.current.maneuverPoints < 1) {
        debug(
          'checkUnitManeuverPoints: No maneuverPoints remaining! - unit.unitStats.current.maneuverPoints:',
          unit.unitStats.current.maneuverPoints
        );
        return;
      }

      debug(
        'checkUnitManeuverPoints: maneuverPoints remaining:',
        unit.unitStats.current.maneuverPoints
      );
      next();
    }
  };
};
