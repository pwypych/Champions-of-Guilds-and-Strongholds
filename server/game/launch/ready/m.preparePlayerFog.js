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

      const fogArray = [];

      _.times(mapData.width, (x) => {
        fogArray[x] = [];
        _.times(mapData.height, (y) => {
          fogArray[x][y] = true;
        });
      });

      diminishFog(gameId, playerId, mapData, heroPosition, fogArray, done);
    }

    function diminishFog(gameId, playerId, mapData, heroPosition, fogArray, done) {
      const diminishRange = 3;
      const positionArray = toolAroundPositions(fogArray, heroPosition, diminishRange, mapData.width, mapData.height);

      positionArray.forEach((position) => {
        fogArray[position.y][position.x] = false;
      });

      debug('diminishFog: fogArray:', toolDebugFogArray(fogArray));
      updatePlayerFogArray(gameId, playerId, fogArray, done);
    }

    function updatePlayerFogArray(gameId, playerId, fogArray, done) {
      const query = { _id: gameId };

      const field = playerId + '.fogArray';
      const $set = {};
      $set[field] = fogArray;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error, result) => {
          if (error) {
            debug('updatePlayerFogArray: ERROR: insert mongo error:', error);
            return;
          }

          debug('updatePlayerFogArray', result.result);
          done();
        }
      );
    }

    function toolAroundPositions(fogArray, positionInitial, range, widthMax, heightMax) {
      let positionArray = [];

      positionArray.push(positionInitial);

      _.times(range, () => {
        positionArray.forEach((positionToScan) => {
          positionArray = _.union(positionArray, toolAroundSinglePosition(positionToScan));
        });
      });

      positionArray = _.uniqWith(positionArray, _.isEqual);

      positionArray = _.filter(positionArray, (position) => {
        if (position.x < 0) {
          return false;
        }
        if (position.y < 0) {
          return false;
        }
        if (position.x >= widthMax) {
          return false;
        }
        if (position.y >= heightMax) {
          return false;
        }
        return true;
      });

      return positionArray;
    }

    function toolAroundSinglePosition(positionInitial) {
      const positionArray = [];
      [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }].forEach(
        (offset) => {
          const position = {};
          position.x = positionInitial.x + offset.x;
          position.y = positionInitial.y + offset.y;
          positionArray.push(position);
        }
      );
      return positionArray;
    }

    function toolDebugFogArray(fogArray) {
      let string = '\n';
      fogArray.forEach((row) => {
        row.forEach((isFog) => {
          if (isFog) {
            string += 'X';
          } else {
            string += ' ';
          }
        });
        string += '\n';
      });

      return string;
    }

  };
};
