// @format

'use strict';

const debug = require('debug')('cogs:positionUpdate');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Updates entity position in database, based last position in path'
      );
      const entities = res.locals.entities;
      const gameId = entities._id;
      const entityId = res.locals.entityId;
      const path = res.locals.path;

      calculatePosition(gameId, entityId, path);
    })();

    function calculatePosition(gameId, entityId, path) {
      const position = path[path.length - 1];

      debug('calculatePosition: position', position);
      positionUpdate(gameId, entityId, position);
    }

    function positionUpdate(gameId, entityId, position) {
      const query = { _id: gameId };

      const fieldEntityX = entityId + '.position.x';
      const fieldEntityY = entityId + '.position.y';
      const $set = {};
      $set[fieldEntityX] = position.x;
      $set[fieldEntityY] = position.y;

      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('ERROR: insert mongo error:', error);
          }
          debug('positionUpdate: Success!');
          next();
        }
      );
    }
  };
};
