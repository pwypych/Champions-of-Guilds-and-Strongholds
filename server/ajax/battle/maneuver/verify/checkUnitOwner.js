// @format

'use strict';

const debug = require('debug')('cogs:checkUnitOwner');

// What does this module do?
// Check if player sending request is owner of unit
module.exports = (findEntitiesByGameId) => {
  return (gameId, unitId, playerId, callback) => {
    (function init() {
      debug('init: gameId:', gameId);
      debug('init: unitId:', unitId);
      debug('init: playerId:', playerId);
      runFindEntitiesByGameId();
    })();

    function runFindEntitiesByGameId() {
      findEntitiesByGameId(gameId, (error, entities) => {
        debug('runFindEntitiesByGameId: entities._id:', entities._id);
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
