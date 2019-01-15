// @format

'use strict';

const debug = require('debug')('cogs:checkUnitActive');

// What does this module do?
// Middleware, check is unit active (it's "active" component is set to true)
module.exports = () => {
  return (req, res, next) => {
    (function init() {
      const entities = res.locals.entities;
      const unit = entities[res.locals.unitId];

      debug('init: unitId:', res.locals.unitId);
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
