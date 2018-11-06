// @format

'use strict';

const debug = require('debug')('cogs:createGameInstancePost');
const shortid = require('shortid');
const validator = require('validator');

module.exports = (environment, db) => {
  return (req, res) => {
    let mapObject;
    const gameInstance = {};

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
      const mapName = validator.whitelist(
        req.body.mapName,
        'abcdefghijklmnopqrstuvwxyz01234567890|_'
      );
      debug('checkRequestBody', mapName);
      findMap(mapName);
    }

    function findMap(mapName) {
      const query = { _id: mapName };
      const options = {};

      db.collection('mapCollection').findOne(query, options, (error, data) => {
        if (error) {
          debug('findMap: error:', error);
          res.status(503).send('503 Service Unavailable - Cannot find map');
          return;
        }

        mapObject = data;

        debug('findMap: mapObject._id:', mapObject._id);
        generateGameInstance();
      });
    }

    function generateGameInstance() {
      gameInstance._id = shortid.generate();

      gameInstance.mapName = mapObject._id;

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
      debug('generateGameInstance', gameInstance._id);
      convertFromTiled();
    }

    function convertFromTiled() {
      // We convert tiled layer which is long array of numbers [0, 0, 0, 1, 0 ...] to two dimentional array of numbers
      const mapLayerWithNumbers = toolConvertTiledLayer(
        mapObject.tiledMapObject.layers[0]
      );
      debug(
        'convertFromTiled:mapLayerWithNumbers:',
        JSON.stringify(mapLayerWithNumbers).slice(0, 50)
      );

      // We convert tiled id of tile to its tile "value", that will become figureName
      const mapLayerWithStrings = toolConvertNumbersToNames(
        mapLayerWithNumbers,
        mapObject.tiledTilesetObject.tiles
      );
      debug(
        'convertFromTiled:mapLayer:',
        JSON.stringify(mapLayerWithStrings).slice(0, 50)
      );

      debug('convertFromTiled');
      generateMapLayerFigures(mapLayerWithStrings);
    }

    function generateMapLayerFigures(mapLayerWithStrings) {
      gameInstance.mapLayer = mapLayerWithStrings;
      debug('generateMapLayerFigures');
      insertGameInstance();
    }

    function insertGameInstance() {
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
