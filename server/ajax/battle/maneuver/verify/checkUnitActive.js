// @format

'use strict';

const debug = require('debug')('cogs:checkUnitActive');

// What does this module do?
// Check is unit active (it's "active" component is set to true)
module.exports = (findEntitiesByGameId) => {
  return (gameId, unitId, callback) => {
    (function init() {
      debug('init: gameId:', gameId);
      debug('init: unitId:', unitId);
      runFindEntitiesByGameId();
    })();

    function runFindEntitiesByGameId() {
      findEntitiesByGameId(gameId, (error, entities) => {
        debug('runFindEntitiesByGameId: entities._id:', entities._id);
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

      debug('isUnitActive: unit.active:', unit.active);
      callback(null, true);
    }
  };
};
