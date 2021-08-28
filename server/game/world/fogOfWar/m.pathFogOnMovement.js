// @format

'use strict';

const debug = require('debug')('cogs:pathFogOnMovement');
const _ = require('lodash');
const async = require('async');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('// Updates fogArray player that moves the hero');
      const entities = res.locals.entities;
      const entityId = res.locals.entityId;
      const path = res.locals.path;

      // early next();
      next();

      findPlayer(entities, entityId, path);
    })();

    function findPlayer(entities, entityId, path) {
      const hero = entities[entityId];
      const playerId = hero.owner;
      const player = entities[playerId];
      const fogArray = player.fogArray;
      const gameId = entities._id;
      const mapData = entities[gameId].mapData;

      console.log(player);
      console.log(path);
      console.log(gameId);

      forEachPathPosition(gameId, playerId, fogArray, path, mapData);
    }

    function forEachPathPosition(gameId, playerId, fogArray, path, mapData) {
      async.eachSeries(
        path,
        (position, done) => {
          diminishFog(gameId, playerId, fogArray, position, mapData, done);
        },
        (error) => {
          debug('forEachPathPosition: Done!');
        }
      );
    }

    function diminishFog(gameId, playerId, fogArray, position, mapData, done) {
      const diminishRange = 3;
      const positionWithoutFogArray = toolAroundPositions(
        fogArray,
        position,
        diminishRange,
        mapData.width,
        mapData.height
      );

      positionWithoutFogArray.forEach((positionWithoutFog) => {
        fogArray[positionWithoutFog.y][positionWithoutFog.x] = false;
      });

      debug('diminishFog: position:', position);
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

    function toolAroundPositions(
      fogArray,
      positionInitial,
      range,
      widthMax,
      heightMax
    ) {
      let positionArray = [];

      positionArray.push(positionInitial);

      _.times(range, () => {
        positionArray.forEach((positionToScan) => {
          positionArray = _.union(
            positionArray,
            toolAroundSinglePosition(positionToScan)
          );
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
      [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 }
      ].forEach((offset) => {
        const position = {};
        position.x = positionInitial.x + offset.x;
        position.y = positionInitial.y + offset.y;
        positionArray.push(position);
      });
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
