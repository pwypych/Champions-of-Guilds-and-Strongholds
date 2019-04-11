// @format

'use strict';

const debug = require('debug')('cogs:createGamePost');
const shortid = require('shortid');
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

          debug('findParcels: parcelArray.length:', parcelArray.length);
          sortParcelArray(parcelArray);
        });
    }

    function sortParcelArray(parcelArray) {
      const sortedParcelObject = {};
      sortedParcelObject.castle = [];
      sortedParcelObject.treasure = [];

      parcelArray.forEach((parcel) => {
        if (parcel.category === 'castle') {
          sortedParcelObject.castle.push(parcel);
        }

        if (parcel.category === 'treasure') {
          sortedParcelObject.treasure.push(parcel);
        }
      });

      debug(
        'sortParcelArray: sortedParcelObject.castle.length:',
        sortedParcelObject.castle.length
      );
      debug(
        'sortParcelArray: sortedParcelObject.treasure.length:',
        sortedParcelObject.treasure.length
      );

      generateSuperParcel(sortedParcelObject);
    }

    function generateSuperParcel(sortedParcelObject) {
      const superParcel = [];
      const width = 5;
      const height = 5;
      const treasureParcelCount = sortedParcelObject.treasure.length - 1;
      debug('generateSuperParcel: treasureParcelCount:', treasureParcelCount);

      for (let y = 0; y < width; y += 1) {
        superParcel[y] = [];
        for (let x = 0; x < height; x += 1) {
          superParcel[y][x] =
            sortedParcelObject.treasure[_.random(0, treasureParcelCount)];
        }
      }

      superParcel[0][0] = sortedParcelObject.castle[1];
      superParcel[width - 1][height - 1] = sortedParcelObject.castle[0];

      debug('generateSuperParcel: superParcel.length:', superParcel.length);
      forEachSuperParcelY(superParcel);
    }

    function forEachSuperParcelY(superParcel) {
      const result = [];
      superParcel.forEach((superParcelRow, superParcelY) => {
        forEachSuperParcelX(superParcelRow, superParcelY, result);
      });

      debug('forEachSuperParcelY: result.length:', result.length);
      debug('forEachSuperParcelY: result[0].length:', result[0].length);
      generateGameEntity(result);
    }

    function forEachSuperParcelX(superParcelRow, superParcelY, result) {
      superParcelRow.forEach((parcel, superParcelX) => {
        forEachParcelY(parcel, superParcelY, superParcelX, result);
      });
    }

    function forEachParcelY(parcel, superParcelY, superParcelX, result) {
      parcel.parcelLayerWithStrings.forEach((parcelRow, parcelY) => {
        const y = parcelY + 7 * superParcelY;
        if (!_.isArray(result[y])) {
          result[y] = [];
        }
        forEachParcelX(parcelRow, parcelY, y, superParcelX, result);
      });
    }

    function forEachParcelX(parcelRow, parcelY, y, superParcelX, result) {
      parcelRow.forEach((tile, parcelX) => {
        const x = parcelX + 7 * superParcelX;
        result[y][x] = tile;
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
