// @format

'use strict';

const debug = require('debug')('cogs:checkIsUnitManeuverZero');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// If unit has no maneuvers left it returns true, if unit does have maneuvers it returns false'
      );

      const entities = res.locals.entities;
      const entityId = res.locals.entityId;
      const unit = entities[entityId];

      isUnitManeuverZero(unit);
    })();

    function isUnitManeuverZero(unit) {
      if (unit.unitStats.current.maneuver < 1) {
        debug(
          'isUnitManeuverZero: Yes, no maneuvers remaining:',
          unit.unitStats.current.maneuver
        );
        next();
        return;
      }

      debug(
        'isUnitManeuverZero: No, maneuvers remaining:',
        unit.unitStats.current.maneuver
      );
    }
  };
};
