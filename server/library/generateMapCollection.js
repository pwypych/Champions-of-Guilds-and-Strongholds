// @format

'use strict';

const debug = require('debug')('cogs:generateMapCollection');
const fs = require('fs');
const _ = require('lodash');

// Map base folder is in /tiledMap/ and has a folder for each map
// Map folder should have a name, f.ex "desert" and jsonfile desert.json
// We need tileset files in /tiledTileset/ folder

// @todo
// refactor names, tool functions should be located in waterfall

// What does this module do?
// Reloads tiled map files into database
module.exports = (environment, db) => {
  return (callback) => {
    const errorArray = [];

    (function init() {
      debug('init');
      dropMapCollection();
    })();

    function dropMapCollection() {
      db.collection('mapCollection').drop((error) => {
        if (error) {
          // When no map collection this error is thrown, ignore it
          if (error.message !== 'ns not found') {
            callback('remove mongo error:' + JSON.stringify(error));
            return;
          }
        }

        debug('dropMapCollection');
        scanMapBaseFolder();
      });
    }

    function scanMapBaseFolder() {
      fs.readdir(environment.basepathTiledMap, (error, folderNameArray) => {
        debug('scanMapBaseFolder: folderNameArray:', folderNameArray);
        forEachFolderName(folderNameArray);
      });
    }

    function forEachFolderName(folderNameArray) {
      const done = _.after(folderNameArray.length, () => {
        debug('forEachFolderName: done!');
        checkForEachErrorArray(folderNameArray.length);
      });

      folderNameArray.forEach((folderName) => {
        debug('forEachFolderName', folderName);
        instantiateMapObject(folderName, done);
      });
    }

    function instantiateMapObject(folderName, done) {
      const mapObject = {};
      mapObject._id = folderName;
      mapObject.folderName = folderName;

      mapObject.pathTiledMap =
        environment.basepathTiledMap +
        '/' +
        folderName +
        '/' +
        folderName +
        '.json';

      debug('instantiateMapObject: mapObject:', mapObject);
      checkTiledMapFileExists(mapObject, done);
    }

    function checkTiledMapFileExists(mapObject, done) {
      fs.stat(mapObject.pathTiledMap, (error, stats) => {
        if (error) {
          errorArray.push(
            mapObject.folderName +
              ': checkTiledMapFileExists: File does not exist, or other read error'
          );
          done();
          return;
        }

        debug('checkTiledMapFileExists: stats.size', stats.size);
        readTiledMapFile(mapObject, done);
      });
    }

    function readTiledMapFile(mapObject, done) {
      fs.readFile(mapObject.pathTiledMap, 'utf8', (error, tiledMapString) => {
        debug('readTiledMapFile', tiledMapString.length);
        parseJsonMapString(mapObject, tiledMapString, done);
      });
    }

    function parseJsonMapString(mapObject, tiledMapString, done) {
      let tiledMapObject;
      try {
        tiledMapObject = JSON.parse(tiledMapString);
      } catch (error) {
        errorArray.push(
          mapObject.folderName +
            ': parseJsonMapString: JSON parse error, not valid map file'
        );
        done();
        return;
      }

      debug(
        'parseJsonMapString: mapObject.tiledMapObject.height:',
        tiledMapObject.height
      );
      validateTiledMapObject(mapObject, tiledMapObject, done);
    }

    function validateTiledMapObject(mapObject, tiledMapObject, done) {
      if (!tiledMapObject.layers) {
        errorArray.push(
          mapObject.folderName +
            ': validateTiledMapObject: tiledMapObject missing layers array'
        );
        done();
        return;
      }

      if (!Array.isArray(tiledMapObject.layers)) {
        errorArray.push(
          mapObject.folderName +
            ': validateTiledMapObject: tiledMapObject.layers is not array'
        );
        done();
        return;
      }

      debug(
        'validateTiledMapObject: tiledMapObject.layers[0].data.length:',
        tiledMapObject.layers[0].data.length
      );
      readTilesetFiles(mapObject, tiledMapObject, done);
    }

    function readTilesetFiles(mapObject, tiledMapObject, done) {
      const filePathArray = [
        environment.basepathTiledTileset + '/1x1.json',
        environment.basepathTiledTileset + '/3x3.json'
      ];
      const tiledTilesetArrayDeep = [];

      const doneTilesets = _.after(filePathArray.length, () => {
        const tiledTilesetArray = _.flatten(tiledTilesetArrayDeep);
        debug('readTilesetFiles', tiledTilesetArray);
        convertFromTiled(mapObject, tiledMapObject, tiledTilesetArray, done);
      });

      filePathArray.forEach((filepath) => {
        fs.readFile(filepath, 'utf8', (error, tiledTilesetString) => {
          const tiledTilesetObject = JSON.parse(tiledTilesetString);

          // all tilesets .json files in tiled starts at 0, but on tilemap the numbers starts from 1 up
          // the tileset firstgid property in tilemap file tells what is the offset between tile id in tileset
          // and tile id in tilemap layer

          // find firstgid
          const tilesetName = tiledTilesetObject.name; // ex. 3x3
          let tiledFirstGid;
          tiledMapObject.tilesets.forEach((tilesetInfo) => {
            if (tilesetInfo.source.includes(tilesetName)) {
              tiledFirstGid = tilesetInfo.firstgid;
            }
          });

          debug('readTilesetFiles: name:', tiledTilesetObject.name);
          debug('readTilesetFiles: filepath:', filepath);
          debug('readTilesetFiles: firstgid:', tiledFirstGid);

          const tiledTiles = toolConvertTilesetTileIndexes(
            tiledTilesetObject.tiles,
            tiledFirstGid
          );

          tiledTilesetArrayDeep.push(tiledTiles);
          doneTilesets();
        });
      });
    }

    function convertFromTiled(
      mapObject,
      tiledMapObject,
      tiledTilesetArray,
      done
    ) {
      // We convert tiled layer which is long array of numbers [0, 0, 0, 1, 0 ...] to two dimentional array of numbers
      const mapLayerWithNumbers = toolConvertTiledLayer(
        tiledMapObject.layers[0]
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
        errorArray.push(
          mapObject.folderName + ': Errors in Tiled tiles: ' + error.message
        );
        done();
        return;
      }

      debug(
        'convertFromTiled:mapLayer:',
        JSON.stringify(mapLayerWithStrings).slice(0, 50)
      );

      debug('convertFromTiled');
      mapObject.mapLayerWithStrings = mapLayerWithStrings;

      insertMapObject(mapObject, done);
    }

    function insertMapObject(mapObject, done) {
      db.collection('mapCollection').insertOne(mapObject, (error) => {
        if (error) {
          errorArray.push(
            mapObject.folderName +
              ': ERROR: insert mongo error:' +
              JSON.stringify(error)
          );
        }

        debug('insertMapObject');
        done();
      });
    }

    function checkForEachErrorArray(loadedMapCount) {
      debug('checkForEachErrorArray');
      if (!_.isEmpty(errorArray)) {
        callback('\n ' + errorArray.join(' \n '));
        return;
      }

      callback(null, loadedMapCount);
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
