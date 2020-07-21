// @format

'use strict';

const debug = require('debug')('cogs:ifEveryUnitManeuverZeroRefill');
const _ = require('lodash');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// If every unit in battle has no maneuverPoints left it returns true, if any unit does have maneuverPoints it returns false'
      );

      const entities = res.locals.entities;
      const gameId = entities._id;

      checkEveryUnitManeuverComponent(entities, gameId);
    })();

    function checkEveryUnitManeuverComponent(entities, gameId) {
      let isEveryUnitManeuverZero = true;
      _.forEach(entities, (entity) => {
        if (entity.unitStats) {
          if (entity.unitStats.current.maneuverPoints > 0) {
            isEveryUnitManeuverZero = false;
          }
        }
      });

      if (isEveryUnitManeuverZero) {
        debug(
          'checkEveryUnitManeuverComponent: isEveryUnitManeuverZero:',
          isEveryUnitManeuverZero
        );
        updateSetEveryUnitCurrentManeuverToBase(entities, gameId);
        return;
      }

      debug(
        'checkEveryUnitManeuverComponent: isEveryUnitManeuverZero:',
        isEveryUnitManeuverZero
      );
      next();
    }

    function updateSetEveryUnitCurrentManeuverToBase(entities, gameId) {
      const query = { _id: gameId };
      const $set = {};
      _.forEach(entities, (entity, id) => {
        if (entity.unitStats) {
          const field = id + '.unitStats.current.maneuverPoints';
          $set[field] = entity.unitStats.base.maneuverPoints;
        }
      });
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateSetEveryUnitCurrentManeuverToBase: error:', error);
          }

          debug('updateSetEveryUnitCurrentManeuverToBase: Finished');
          next();
        }
      );
    }
  };
};
