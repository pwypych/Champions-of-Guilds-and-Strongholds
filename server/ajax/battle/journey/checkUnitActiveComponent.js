// @format

'use strict';

const debug = require('debug')('cogs:checkUnitActiveComponent');

// What does this module do?
// Middleware, check is current unit active component true
module.exports = () => {
  return (req, res, next) => {
    (function init() {
      const entities = res.locals.entities;
      const unit = entities[res.locals.unitId];

      debug('init: unit:', unit);
      isUnitActive(unit);
    })();

    function isUnitActive(unit) {
      if (!unit.active) {
        debug('isUnitActive: unit.active:', unit.active);
        return;
      }

      debug('isUnitActive: unit.active:', unit.active);
      next();
    }
  };
};
