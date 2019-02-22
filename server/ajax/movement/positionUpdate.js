// @format

'use strict';

const debug = require('debug')('cogs:positionUpdate');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Updates unit position in database, based last position in path'
      );
      const entities = res.locals.entities;
      const gameId = entities._id;
      const unitId = res.locals.unitId;
      const path = res.locals.path;

      calculatePosition(gameId, unitId, path);
    })();

    function calculatePosition(gameId, unitId, path) {
      const position = path[path.length - 1];

      debug('calculatePosition: position', position);
      positionUpdate(gameId, unitId, position);
    }

    function positionUpdate(gameId, unitId, position) {
      const query = { _id: gameId };

      const fieldUnitX = unitId + '.position.x';
      const fieldUnitY = unitId + '.position.y';
      const $set = {};
      $set[fieldUnitX] = position.x;
      $set[fieldUnitY] = position.y;

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
