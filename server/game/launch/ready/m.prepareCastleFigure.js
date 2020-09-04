// @format

'use strict';

const debug = require('debug')('cogs:prepareCastleFigure');
const _ = require('lodash');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('// Assign castles to players, give them owner and color property');
      const entities = res.locals.entities;

      generateCastleArray(entities);
    })();

    function generateCastleArray(entities) {
      const playerArray = [];
      const castleArray = [];

      _.forEach(entities, (entity, id) => {
        if (entity.playerData) {
          entity.id = id;
          playerArray.push(entity);
        }

        if (entity.figureName === 'castleRandom') {
          entity.id = id;
          castleArray.push(entity);
        }
      });

      if (playerArray.length !== castleArray.length) {
        throw new Error('Castle and Player number are not equal');
      }

      debug('generateCastleArray: castleArray.length:', castleArray.length);
      forEachCastle(castleArray, playerArray, entities);
    }

    function forEachCastle(castleArray, playerArray, entities) {
      const done = _.after(castleArray.length, () => {
        debug('forEachCastle: done!');
        next();
      });

      _.forEach(castleArray, (castle, index) => {
        const castleId = castle.id;
        const owner = playerArray[index].id;
        const color = playerArray[index].playerData.color;

        updateCastle(castleId, owner, color, entities, done);
      });
    }

    function updateCastle(castleId, owner, color, entities, done) {
      const gameId = entities._id;

      const $set = {};
      const fieldColor = castleId + '.color';
      $set[fieldColor] = color;

      const fieldOwner = castleId + '.owner';
      $set[fieldOwner] = owner;

      const query = { _id: gameId };
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug(gameId, ': ERROR: update mongo error:', error);
          }

          done();
        }
      );
    }
  };
};
