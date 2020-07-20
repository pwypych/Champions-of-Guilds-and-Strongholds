// @format

'use strict';

const debug = require('debug')('cogs:preparePlayerResource');
const _ = require('lodash');

module.exports = (db, blueprint) => {
  return (req, res, next) => {
    (function init() {
      debug('// Set every player resources depending on chosen race');

      const entities = res.locals.entities;

      forEachPlayerEntity(entities);
    })();

    function forEachPlayerEntity(entities) {
      const done = _.after(_.size(entities), () => {
        debug('forEachPlayer: done!');
        next();
      });

      _.forEach(entities, (entity, id) => {
        if (entity.playerToken && entity.playerData) {
          const gameId = entities._id;
          const playerId = id;
          const playerRace = entity.playerData.race;
          updatePlayerResources(gameId, playerId, playerRace, done);
          return;
        }

        done();
      });
    }

    function updatePlayerResources(gameId, playerId, playerRace, done) {
      const query = { _id: gameId };

      const field = playerId + '.playerResources';
      const $set = {};
      $set[field] = blueprint.race[playerRace].playerResources;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error, result) => {
          if (error) {
            debug('updatePlayerResources: ERROR: insert mongo error:', error);
            return;
          }

          debug('updatePlayerResources', result.result);
          done();
        }
      );
    }
  };
};
