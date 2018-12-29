// @format

'use strict';

const debug = require('debug')('cogs:preparePlayerResource');
const _ = require('lodash');

// What does this module do?
// Set every player resources depending on chosen race
module.exports = (db) => {
  return (req, res, next) => {
    const raceResourceMap = {
      human: {
        wood: 0,
        stone: 0,
        gold: 0,
        crystal: 0
      },
      orc: {
        wood: 5,
        stone: 15,
        gold: 4000,
        crystal: 2
      }
    };

    (function init() {
      const entities = res.locals.entities;

      debug('init');
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

      const mongoFieldToSet = playerId + '.playerResources';
      const $set = {};
      $set[mongoFieldToSet] = raceResourceMap[playerRace];
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
