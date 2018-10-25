// @format

'use strict';

const debug = require('debug')('cogs:createGameInstancePost');
const shortid = require('shortid');

module.exports = (environment, sanitizer, db) => {
  return (req, res) => {
    (function init() {
      debug('init');
      checkRequestBody();
    })();

    function checkRequestBody() {
      if (!req.body.mapName) {
        debug('checkRequestBody: error: ', req.body);
        res
          .status(503)
          .send('503 Error - Wrong POST parameter or empty mapName parameter');
        return;
      }

      debug('checkRequestBody');
      sanitizeRequestBody();
    }

    function sanitizeRequestBody() {
      const mapName = sanitizer.sanitizeMapName(req.body.mapName);
      debug('checkRequestBody', mapName);
      findMap(mapName);
    }

    function findMap(mapName) {
      const query = { _id: mapName };
      const options = {};

      db.collection('mapCollection').findOne(
        query,
        options,
        (error, mapObject) => {
          if (error) {
            debug('findMap: error:', error);
            res.status(503).send('503 Error - Cannot find map');
            return;
          }

          debug('findMap', mapObject._id);
          prepareGameInstance(mapObject);
        }
      );
    }

    function prepareGameInstance(mapObject) {
      const gameInstance = {};

      gameInstance._id = shortid.generate();

      gameInstance.mapName = mapObject._id;

      // We convert tiled layer which is long array of numbers [0, 0, 0, 1, 0 ...] to two dimentional array of numbers
      const mapLayerNumbers = toolConvertTiledLayer(mapObject.layers[0]);

      // We convert tiled id of tile to its tile "value", that will become figureName
      gameInstance.mapLayer = toolConvertNumbersToNames(
        mapLayerNumbers,
        mapObject.tilesetObject.tiles
      );

      gameInstance.playerArray = [];

      const playerOne = {};
      playerOne.token = shortid.generate();
      playerOne.name = 'Player 1';
      gameInstance.playerArray.push(playerOne);

      const playerTwo = {};
      playerTwo.token = shortid.generate();
      playerTwo.name = 'Player 2';
      gameInstance.playerArray.push(playerTwo);

      // debug('gameInstance.mapLayer: %o', gameInstance.mapLayer);
      debug('prepareGameInstance', gameInstance._id);
      insertGameInstance(gameInstance);
    }

    function insertGameInstance(gameInstance) {
      db.collection('gameInstanceCollection').insertOne(
        gameInstance,
        (error) => {
          if (error) {
            debug('insertGameInstance: error:', error);
            res.status(503).send('503 Error - Cannot insert game instance');
          }

          debug('insertGameInstance', gameInstance.mapName);
          sendResponce();
        }
      );
    }

    function sendResponce() {
      debug('sendResponce()');
      debug('******************** should redirect ********************');
      res.redirect(environment.baseurl + '/gamePanel');
    }

    function toolConvertTiledLayer(tiledLayer) {
      const data = tiledLayer.data;
      const height = tiledLayer.height;
      const width = tiledLayer.width;

      const mapLayer = [];

      for (let i = 0; i < height; i += 1) {
        mapLayer.push([]);
      }

      let x = 0;
      let y = 0;

      data.forEach((tileId) => {
        mapLayer[y].push(tileId);

        if (x >= width - 1) {
          y += 1;
          x = 0;
        } else {
          x += 1;
        }
      });

      return mapLayer;
    }

    function toolConvertNumbersToNames(mapLayerNumbers, tiledTileArray) {
      const mapLayer = mapLayerNumbers.slice(); // slice with no arguments copies array

      // each y, x multidimentional array
      mapLayerNumbers.forEach((row, y) => {
        row.forEach((number, x) => {
          const tileIdFromLayer = number + 1; // tiled saves as id + 1 on layer array

          debug(y, x, tileIdFromLayer);

          tiledTileArray.forEach((tiledTile) => {
            // for every tile defined in tiled
            if (tiledTile.id !== tileIdFromLayer) {
              return;
            }

            // if number + 1 is equal id of a tile from tiled
            if (!tiledTile.properties[0].value) {
              // if value does not exists it is empty
              mapLayer[y][x] = 'empty';
              return;
            }

            mapLayer[y][x] = tiledTile.properties[0].value; // use that value as name
          });
        });
      });

      return mapLayer;
    }
  };
};
