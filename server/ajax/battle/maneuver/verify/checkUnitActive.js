// @format

'use strict';

const debug = require('debug')('cogs:checkUnitActive');

module.exports = (findEntitiesByGameId) => {
  return (gameId, unitId, callback) => {
    (function init() {
      debug('// Check is unit active (its "active" component is set to true)');

      runFindEntitiesByGameId();
    })();

    function runFindEntitiesByGameId() {
      findEntitiesByGameId(gameId, (error, entities) => {
        debug('runFindEntitiesByGameId');
        isUnitActive(entities);
      });
    }

    function isUnitActive(entities) {
      const unit = entities[unitId];
      if (!unit.active) {
        debug('isUnitActive: unit.active:', unit.active);
        callback(null, false);
        return;
      }

      debug('isUnitActive: Yes!');
      callback(null, true);
    }
  };
};
