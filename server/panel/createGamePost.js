// @format

'use strict';

const debug = require('debug')('cogs:createGamePost');
const shortid = require('shortid');
const validator = require('validator');
const _ = require('lodash');

module.exports = (environment, db, figureManagerTree) => {
  return (req, res) => {
    let mapObject;
    const game = {};

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
        generateGameProperties();
      });
    }

    function generateGameProperties() {
      game._id = shortid.generate();

      game.mapName = mapObject._id;

      game.state = 'launchState';

      // debug('game.mapLayer: %o', game.mapLayer);
      debug('generateGameProperties', game._id);
      generatePlayerArray();
    }

    function generatePlayerArray() {
      const playerCount = 3;
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

      game.playerArray = _.times(playerCount, (index) => {
        const player = {};
        player.token = shortid.generate();
        player.name = 'Player ' + (index + 1);
        player.color = colorArray[index];
        player.ready = false;
        player.race = 'human';
        return player;
      });

      debug(
        'generatePlayerArray:game.playerArray.length',
        game.playerArray.length
      );
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
      instantiateFigures(mapLayerWithStrings);
    }

    function instantiateFigures(mapLayerWithStrings) {
      const errorArray = [];
      game.mapLayer = [];

      mapLayerWithStrings.forEach((row, y) => {
        game.mapLayer[y] = [];
        row.forEach((figureName, x) => {
          if (!figureManagerTree[figureName]) {
            const error =
              'Cannot load figure that is required by the map: ' + figureName;
            errorArray.push(error);
            return;
          }

          if (!figureManagerTree[figureName].produce) {
            const error =
              'Cannot load blueprint for figure that is required by the map: ' +
              figureName;
            errorArray.push(error);
            return;
          }

          const figure = figureManagerTree[figureName].produce();

          // Add unique id to each figure instance
          figure._id = shortid.generate();

          game.mapLayer[y][x] = figure;
        });
      });

      if (!_.isEmpty(errorArray)) {
        debug('instantiateFigures: errorArray:', errorArray);
        res
          .status(503)
          .send('503 Service Unavailable - ' + JSON.stringify(errorArray));
        return;
      }

      debug('instantiateFigures');
      insertGame();
    }

    function insertGame() {
      db.collection('gameCollection').insertOne(game, (error) => {
        if (error) {
          debug('insertGame: error:', error);
          res
            .status(503)
            .send('503 Service Unavailable - Cannot insert game instance');
        }

        debug('insertGame', game.mapName);
        sendResponce();
      });
    }

    function sendResponce() {
      debug('sendResponce()');
      debug('******************** should redirect ********************');
      res.redirect(environment.baseurl + '/panel');
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
