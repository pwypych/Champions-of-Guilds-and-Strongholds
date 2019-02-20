// @format

'use strict';

const debug = require('debug')('cogs:updateUnitPosition');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Updates unit position in database, based last position in unitPath'
      );
      const entities = res.locals.entities;
      const gameId = entities._id;
      const unitId = res.locals.unitId;
      const unitPath = res.locals.unitPath;

      calculatePosition(gameId, unitId, unitPath);
    })();

    function calculatePosition(gameId, unitId, unitPath) {
      const position = unitPath[unitPath.length - 1];

      debug('calculatePosition: position', position);
      updateUnitPosition(gameId, unitId, position);
    }

    function updateUnitPosition(gameId, unitId, position) {
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
          debug('updateUnitPosition: Success!');
          next();
        }
      );
    }
  };
};
