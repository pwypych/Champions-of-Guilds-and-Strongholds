// @format

'use strict';

const debug = require('debug')('cogs:preparePlayerFog');
const _ = require('lodash');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('// Set starting fog for player');

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
          const mapData = entities[gameId].mapData;
          const playerId = id;
          findHeroPosition(entities, gameId, playerId, mapData, done);
          return;
        }

        done();
      });
    }

    function findHeroPosition(entities, gameId, playerId, mapData, done) {
      let heroPosition;

      _.forEach(entities, (entity) => {
        if (entity.heroStats && entity.owner === playerId && entity.position) {
          heroPosition = entity.position;
        }
      });

      debug('findHeroPosition', heroPosition);
      generateFogArray(gameId, playerId, mapData, heroPosition, done);
    }

    function generateFogArray(gameId, playerId, mapData, heroPosition, done) {
      debug('mapData', mapData);
      debug('heroPosition', heroPosition);

      // @todo do this based on generation of movement tiles around a unit

      done();
    }

    // @todo add a function to update player object with fogArray

    // function updatePlayerResources(gameId, playerId, playerRace, done) {
    //   const query = { _id: gameId };

    //   const field = playerId + '.playerResources';
    //   const $set = {};
    //   $set[field] = raceBlueprint()[playerRace].playerResources;
    //   const update = { $set: $set };
    //   const options = {};

    //   db.collection('gameCollection').updateOne(
    //     query,
    //     update,
    //     options,
    //     (error, result) => {
    //       if (error) {
    //         debug('updatePlayerResources: ERROR: insert mongo error:', error);
    //         return;
    //       }

    //       debug('updatePlayerResources', result.result);
    //       done();
    //     }
    //   );
    // }
  };
};
