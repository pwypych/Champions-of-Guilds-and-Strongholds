// @format

'use strict';

const debug = require('debug')('cogs:checkUnitActive');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Check is unit active (its "active" component is set to true)');
      const entities = res.locals.entities;
      const entityId = res.locals.entityId;
      isUnitActive(entities, entityId);
    })();

    function isUnitActive(entities, entityId) {
      const unit = entities[entityId];
      if (!unit.active) {
        debug('isUnitActive: unit.active:', unit.active);
        return;
      }

      debug('isUnitActive: Yes!');
      next();
    }
  };
};
