// @format

'use strict';

const debug = require('debug')('cogs:checkUnitActions');

// What does this module do?
// Middleware, check whether unit have any actions left
module.exports = () => {
  return (req, res, next) => {
    (function init() {
      const entities = res.locals.entities;
      const unit = entities[res.locals.unitId];

      debug('init: unit:', unit);
      checkUnitActionsLeft(unit);
    })();

    function checkUnitActionsLeft(unit) {
      if (unit.actions < 1) {
        debug('checkUnitActionsLeft: No actions - unit.actions:', unit.actions);
        return;
      }

      debug('checkUnitActionsLeft: unit.actions:', unit.actions);
      next();
    }
  };
};
