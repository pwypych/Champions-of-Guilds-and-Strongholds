// @format

'use strict';

const debug = require('debug')('cogs:checkUnitOwner');

module.exports = (findEntitiesByGameId) => {
  return (gameId, unitId, playerId, callback) => {
    (function init() {
      debug('// Check if player sending request is owner of unit');

      runFindEntitiesByGameId();
    })();

    function runFindEntitiesByGameId() {
      findEntitiesByGameId(gameId, (error, entities) => {
        debug('runFindEntitiesByGameId');
        checkUnitOwner(entities);
      });
    }

    function checkUnitOwner(entities) {
      const unit = entities[unitId];
      if (unit.owner !== playerId) {
        debug(
          'checkUnitOwner: owner and playerId are different, unit.owner:',
          unit.owner,
          'playerId',
          playerId
        );
        callback(null, false);
        return;
      }

      debug('checkUnitOwner: Yes!');
      callback(null, true);
    }
  };
};
