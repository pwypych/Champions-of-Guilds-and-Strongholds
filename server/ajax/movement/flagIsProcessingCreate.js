// @format

'use strict';

const debug = require('debug')('cogs:flagIsProcessingCreate');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('// Creates flag to mark that entity is moving right now');
      const entities = res.locals.entities;
      const gameId = entities._id;
      const entityId = res.locals.entityId;
      const path = res.locals.path;
      const pathLength = path.length;

      flagCreate(gameId, entityId, pathLength);
    })();

    function flagCreate(gameId, entityId, pathLength) {
      const query = { _id: gameId };
      const field = entityId + '.isProcessingMovementUntilTimestamp';
      const $set = {};
      const entityMoveTime = 150 * (pathLength - 1); // ms
      const securityMargin = 100; // ms
      $set[field] = Date.now() + entityMoveTime + securityMargin;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('flagCreate: ERROR: ', error);
          }
          debug('flagCreate: isProcessingMovementUntilTimestamp: Created!');
          next();
        }
      );
    }
  };
};
