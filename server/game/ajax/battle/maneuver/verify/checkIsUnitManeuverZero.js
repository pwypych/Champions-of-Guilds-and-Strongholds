// @format

'use strict';

const debug = require('debug')('cogs:checkIsUnitManeuverZero');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// If unit has no maneuverPoints left it returns true, if unit does have maneuverPoints it returns false'
      );

      const entities = res.locals.entities;
      const entityId = res.locals.entityId;
      const unit = entities[entityId];

      isUnitManeuverZero(unit);
    })();

    function isUnitManeuverZero(unit) {
      if (unit.unitStats.current.maneuverPoints < 1) {
        debug(
          'isUnitManeuverZero: maneuverPoints zero!',
          unit.unitStats.current.maneuverPoints
        );
        next();
        return;
      }

      debug(
        'isUnitManeuverZero: maneuverPoints remaining!',
        unit.unitStats.current.maneuverPoints
      );
    }
  };
};
