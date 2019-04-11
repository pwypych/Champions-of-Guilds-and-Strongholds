// @format

'use strict';

const debug = require('debug')('cogs:createGamePost');
const shortid = require('shortid');
const validator = require('validator');
const _ = require('lodash');

module.exports = (environment, db, figureBlueprint) => {
  return (req, res) => {
    (function init() {
      debug(
        '// Creates game in db based on map choosen by a player, sets starting properties'
      );

      findParcels();
    })();

    function findParcels() {
      const query = {};
      const options = {};

      db.collection('parcelCollection')
        .find(query, options)
        .toArray((error, parcelArray) => {
          if (error) {
            debug('findParcels: error:', error);
            res
              .status(503)
              .send(
                '503 Service Unavailable: Mongo error, cannot run find on gameCollection'
              );
            return;
          }

          debug('findParcels', parcelArray);
          generateSuperParcel(parcelArray);
        });
    }

    function generateSuperParcel(parcelArray) {
      const superParcel = [];
      superParcel[0] = [parcelArray[0], parcelArray[1]];
      superParcel[1] = [parcelArray[2], parcelArray[3]];

      debug('generateSuperParcel: superParcel[0]:', superParcel[0]);
      forEachSuperParcelY(superParcel);
    }

    function forEachSuperParcelY(superParcel) {
      const result = [];
      superParcel.forEach((superParcelRow, superParcelY) => {
        // debug('forEachSuperParcelY: superParcelY:', superParcelY);
        forEachSuperParcelX(superParcelRow, superParcelY, result);
      });

      debug('forEachSuperParcelY: result:', result);
      generateGameEntity(result);
    }

    function forEachSuperParcelX(superParcelRow, superParcelY, result) {
      superParcelRow.forEach((parcel, superParcelX) => {
        // debug('forEachSuperParcelX: superParcelX:', superParcelX);
        forEachParcelY(parcel, superParcelY, superParcelX, result);
      });
    }

    function forEachParcelY(parcel, superParcelY, superParcelX, result) {
      parcel.parcelLayerWithStrings.forEach((parcelRow, parcelY) => {
        const y = parcelY + 7 * superParcelY;
        // debug('forEachParcelY: y:', y);
        if (!_.isArray(result[y])) {
          result[y] = [];
        }
        // debug('forEachParcelY: parcelY:', parcelY);
        forEachParcelX(parcelRow, parcelY, y, superParcelX, result);
      });
    }

    function forEachParcelX(parcelRow, parcelY, y, superParcelX, result) {
      parcelRow.forEach((tile, parcelX) => {
        const x = parcelX + 7 * superParcelX;
        result[y][x] = tile;
        debug('forEachParcelX: y:', y, 'x:', x, 'result[y][x]:', result[y][x]);
        // debug('forEachParcelX: tile:', tile);
      });
    }

    function generateGameEntity(result) {
      const entities = {};

      const id = 'game__' + shortid.generate();

      entities._id = id; // mongo id for that game is the same as entitie id for gameEntity

      entities[id] = {};
      entities[id].mapData = {};
      // entities[id].mapData.name = mapObject._id;
      entities[id].mapData.name = 'random_map_2x2';
      entities[id].mapData.width = result[0].length;
      entities[id].mapData.height = result.length;

      entities[id].state = 'launchState';
      entities[id].day = 1;

      debug('generateGameEntity', entities[id]);
      calculatePlayerCount(result, entities);
    }

    function calculatePlayerCount(result, entities) {
      let playerCount = 0;
      result.forEach((row) => {
        row.forEach((tileName) => {
          if (tileName === 'castleRandom') {
            playerCount += 1;
          }
        });
      });

      debug('calculatePlayerCount: playerCount:', playerCount);
      generatePlayerEntities(result, entities, playerCount);
    }

    function generatePlayerEntities(result, entities, playerCount) {
      const colorArray = [
        'red',
        'blue',
        'green',
        'violet',
        'orange',
        'brown',
        'aqua',
        'pink'
      ];

      _.times(playerCount, (index) => {
        const id = 'player__' + shortid.generate();
        entities[id] = {};
        entities[id].playerToken = 'playerToken_' + shortid.generate();
        entities[id].playerData = {};
        entities[id].playerData.name = 'Player ' + (index + 1);
        entities[id].playerData.race = 'human';
        entities[id].playerData.color = colorArray[index];
        debug('generatePlayerEntities: playerEntity:', entities[id]);
      });

      generateFigureEntities(result, entities);
    }

    function generateFigureEntities(result, entities) {
      const errorArray = [];

      result.forEach((row, y) => {
        row.forEach((figureName, x) => {
          // debug('generateFigureEntities: figureName:', figureName);
          if (figureName === 'empty') {
            return;
          }

          if (!figureBlueprint()[figureName]) {
            const error =
              'Cannot load figure that is required by the map: ' + figureName;
            errorArray.push(error);
            return;
          }

          const entity = figureBlueprint()[figureName];

          // Add unique id to each figure instance
          const id = figureName + '_figure__' + shortid.generate();
          entity.figureName = figureName;
          entity.position = { x: x, y: y };

          entities[id] = entity;
        });
      });

      if (!_.isEmpty(errorArray)) {
        debug('generateFigureEntities: errorArray:', errorArray);
        res
          .status(503)
          .send('503 Service Unavailable - ' + JSON.stringify(errorArray));
        return;
      }

      debug('generateFigureEntities');
      insertGame(entities);
      // res.redirect('/panel');
    }

    function insertGame(entities) {
      db.collection('gameCollection').insertOne(entities, (error) => {
        if (error) {
          debug('insertGame: error:', error);
          res
            .status(503)
            .send('503 Service Unavailable - Cannot insert game instance');
        }

        debug('insertGame: _.size(entities):', _.size(entities));
        sendResponse();
      });
    }

    function sendResponse() {
      debug('sendResponse()');
      debug('******************** should redirect ********************');
      res.redirect(environment.baseurl + '/panel');
    }
  };
};
