// @format

'use strict';

const debug = require('debug')('cogs:checkUnitOwner');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Check if player sending request is owner of unit');

      const entities = res.locals.entities;
      const entityId = res.locals.entityId;
      const playerId = res.locals.playerId;

      checkUnitOwner(entities, entityId, playerId);
    })();

    function checkUnitOwner(entities, entityId, playerId) {
      const unit = entities[entityId];
      if (unit.owner !== playerId) {
        debug(
          'checkUnitOwner: owner and playerId are different, unit.owner:',
          unit.owner,
          'playerId',
          playerId
        );
        return;
      }

      debug('checkUnitOwner: Yes!');
      next();
    }
  };
};
