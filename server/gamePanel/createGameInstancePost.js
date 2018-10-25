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
      if (typeof req.body.mapName !== 'string') {
        debug('checkRequestBody: mapName not a string: ', req.body);
        res
          .status(503)
          .send(
            '503 Service Unavailable - Wrong POST parameter or empty mapName parameter'
          );
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
            res.status(503).send('503 Service Unavailable - Cannot find map');
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
      debug(
        'prepareGameInstance:mapLayerNumbers:',
        JSON.stringify(mapLayerNumbers).slice(0, 50)
      );

      // We convert tiled id of tile to its tile "value", that will become figureName
      gameInstance.mapLayer = toolConvertNumbersToNames(
        mapLayerNumbers,
        mapObject.tilesetObject.tiles
      );
      debug(
        'prepareGameInstance:mapLayer:',
        JSON.stringify(gameInstance.mapLayer).slice(0, 50)
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
            res
              .status(503)
              .send('503 Service Unavailable - Cannot insert game instance');
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
      // we will fill that array with Names
      // slice with no arguments copies array
      const mapLayer = mapLayerNumbers.slice();

      // each y, x multidimentional array
      mapLayerNumbers.forEach((row, y) => {
        row.forEach((number, x) => {
          // tiled saves id's within layers with +1 index because it uses 0 as empty
          const tileNumberFromLayer = number - 1;

          // searching for that tile number withing tiledTileArray
          let foundTiledTile;
          tiledTileArray.forEach((tiledTile) => {
            if (tiledTile.id === tileNumberFromLayer) {
              foundTiledTile = tiledTile;
            }
          });

          // if none of the tiles has number we are looking for, use empty
          // @todo maybe add warning that wrong tile ids are used in this map
          if (!foundTiledTile) {
            mapLayer[y][x] = 'empty';
            return;
          }

          // tile properties are an array in tiled tileset. We must go through them to find 'name' property
          let foundValue;
          foundTiledTile.properties.forEach((property) => {
            if (property.name === 'name') {
              foundValue = property.value;
            }
          });

          // if tile has no name property it is considered empty
          if (!foundValue) {
            mapLayer[y][x] = 'empty';
            return;
          }

          mapLayer[y][x] = foundValue;

          // debug('toolConvertNumbersToNames', y, x, mapLayer[y][x]);
        });
      });

      return mapLayer;
    }
  };
};
