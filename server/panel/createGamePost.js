// @format

'use strict';

const debug = require('debug')('cogs:createGamePost');
const shortid = require('shortid');
const validator = require('validator');
const _ = require('lodash');
const fs = require('fs');

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
        player.ready = 'no';
        player.race = 'human';
        return player;
      });

      debug(
        'generatePlayerArray:game.playerArray.length',
        game.playerArray.length
      );
      readTilesetFiles();
    }

    function readTilesetFiles() {
      const filePathArray = [
        environment.basepathTiledTileset + '/1x1.json',
        environment.basepathTiledTileset + '/3x3.json'
      ];
      const tiledTilesetArrayDeep = [];

      const done = _.after(filePathArray.length, () => {
        const tiledTilesetArray = _.flatten(tiledTilesetArrayDeep);
        debug('readTilesetFiles', tiledTilesetArray);
        convertFromTiled(tiledTilesetArray);
      });

      filePathArray.forEach((filepath, index) => {
        fs.readFile(filepath, 'utf8', (error, tiledTilesetString) => {
          const tiledTilesetObject = JSON.parse(tiledTilesetString);

          // all tilesets .json files in tiled starts at 0, but on tilemap the numbers starts from 1 up
          // the tileset firstgid property in tilemap file tells what is the offset between tile id in tileset
          // and tile id in tilemap layer
          const tiledFirstGid =
            mapObject.tiledMapObject.tilesets[index].firstgid;

          const tiledTiles = toolConvertTilesetTileIndexes(
            tiledTilesetObject.tiles,
            tiledFirstGid
          );

          tiledTilesetArrayDeep.push(tiledTiles);
          done();
        });
      });
    }

    function convertFromTiled(tiledTilesetArray) {
      // We convert tiled layer which is long array of numbers [0, 0, 0, 1, 0 ...] to two dimentional array of numbers
      const mapLayerWithNumbers = toolConvertTiledLayer(
        mapObject.tiledMapObject.layers[0]
      );
      debug(
        'convertFromTiled:mapLayerWithNumbers:',
        JSON.stringify(mapLayerWithNumbers).slice(0, 50)
      );

      // We convert tiled id of tile to its tile "value", that will become figureName
      let mapLayerWithStrings;

      try {
        mapLayerWithStrings = toolConvertNumbersToNames(
          mapLayerWithNumbers,
          tiledTilesetArray
        );
      } catch (error) {
        res.status(503);
        res.send(
          '503 Service Unavailable - Errors in Tiled tiles: ' + error.message
        );
        return;
      }

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
          figure._id = figureName + '_y' + y + '_x' + x;

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

    function toolConvertTilesetTileIndexes(tileArray, tiledFirstGid) {
      return tileArray.map((tileObject) => {
        tileObject.id += tiledFirstGid;
        return tileObject;
      });
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

    function toolConvertNumbersToNames(mapLayerNumbers, tiledTilesetArray) {
      // we will fill that array with Names
      // slice with no arguments copies array
      const mapLayer = mapLayerNumbers.slice();

      // each y, x multidimentional array
      mapLayerNumbers.forEach((row, y) => {
        row.forEach((number, x) => {
          // searching for that tile number withing tiledTilesetArray
          let foundTiledTile;
          tiledTilesetArray.forEach((tiledTile) => {
            if (tiledTile.id === number) {
              foundTiledTile = tiledTile;
            }
          });

          // if none of the tiles has number we are looking for, use empty
          // @todo maybe add warning that wrong tile ids are used in this map
          if (!foundTiledTile) {
            mapLayer[y][x] = 'empty';
            return;
          }

          if (!foundTiledTile.properties) {
            throw new Error(
              'Tiled tile has no properties defined: ' + foundTiledTile.image
            );
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
            throw new Error(
              'Tiled tile has no name property defined: ' + foundTiledTile.image
            );
          }

          mapLayer[y][x] = foundValue;

          // debug('toolConvertNumbersToNames', y, x, mapLayer[y][x]);
        });
      });

      return mapLayer;
    }
  };
};
