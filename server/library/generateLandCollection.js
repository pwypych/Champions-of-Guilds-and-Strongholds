// @format

'use strict';

const debug = require('debug')('cogs:generateLandCollection');
const fs = require('fs');
const _ = require('lodash');

// Land base folder is in /tiledLand and should have a name, f.ex "desert" and jsonfile desert.json
// We need tileset for land files in /tiledTileset/ folder

// @todo
// refactor names, tool functions should be located in waterfall
module.exports = (environment, db) => {
  return (callback) => {
    const errorArray = [];

    (function init() {
      debug('// Reloads tiled land files into database');

      dropLandCollection();
    })();

    function dropLandCollection() {
      db.collection('landCollection').drop((error) => {
        if (error) {
          // When no land collection this error is thrown, ignore it
          if (error.message !== 'ns not found') {
            callback('remove mongo error:' + JSON.stringify(error));
            return;
          }
        }

        debug('dropLandCollection');
        scanLandBaseFolder();
      });
    }

    function scanLandBaseFolder() {
      fs.readdir(environment.basepathTiledLand, (error, landNameArray) => {
        debug('scanLandBaseFolder: landNameArray:', landNameArray);
        forEachLandName(landNameArray);
      });
    }

    function forEachLandName(landNameArray) {
      const done = _.after(landNameArray.length, () => {
        debug('forEachLandName: done!');
        checkForEachErrorArray(landNameArray.length);
      });

      landNameArray.forEach((landName) => {
        debug('forEachLandName', landName);
        instantiateLandObject(landName, done);
      });
    }

    function instantiateLandObject(landName, done) {
      const landObject = {};
      landObject._id = landName;
      landObject.name = landName.substring(landName.length - 5, 0);

      landObject.pathTiledLand = environment.basepathTiledLand + '/' + landName;

      // debug('instantiateLandObject: landObject:', landObject);
      checkTiledLandFileExists(landObject, done);
    }

    function checkTiledLandFileExists(landObject, done) {
      fs.stat(landObject.pathTiledLand, (error, stats) => {
        if (error) {
          debug('instantiateLandObject: File does not exist!');
          errorArray.push(
            landObject.folderName +
              ': checkTiledLandFileExists: File does not exist, or other read error'
          );
          done();
          return;
        }

        debug('checkTiledLandFileExists: stats.size', stats.size);
        readTiledLandFile(landObject, done);
      });
    }

    function readTiledLandFile(landObject, done) {
      fs.readFile(
        landObject.pathTiledLand,
        'utf8',
        (error, tiledLandString) => {
          debug('readTiledLandFile', tiledLandString.length);
          parseJsonLandString(landObject, tiledLandString, done);
        }
      );
    }

    function parseJsonLandString(landObject, tiledLandString, done) {
      let tiledLandObject;

      try {
        tiledLandObject = JSON.parse(tiledLandString);
      } catch (error) {
        errorArray.push(
          landObject.folderName +
            ': parseJsonLandString: JSON parse error, not valid map file'
        );
        done();
        return;
      }

      landObject.landHeight = tiledLandObject.height;
      landObject.landWidth = tiledLandObject.width;

      // debug('parseJsonLandString: tiledLandObject:', tiledLandObject);
      validateTiledLandObject(landObject, tiledLandObject, done);
    }

    function validateTiledLandObject(landObject, tiledLandObject, done) {
      if (!tiledLandObject.layers) {
        errorArray.push(
          landObject.folderName +
            ': validateTiledLandObject: tiledLandObject missing layers array'
        );
        done();
        return;
      }

      if (!Array.isArray(tiledLandObject.layers)) {
        errorArray.push(
          landObject.folderName +
            ': validateTiledLandObject: tiledLandObject.layers is not array'
        );
        done();
        return;
      }

      if (tiledLandObject.layers.length !== 3) {
        errorArray.push(
          landObject.folderName +
            ': validateTiledLandObject: tiledLandObject.layers[1].name is not manzeMap'
        );
        done();
        return;
      }

      debug(
        'validateTiledLandObject: tiledLandObject.layers[0].data.length:',
        tiledLandObject.layers[0].data.length
      );
      readTilesetFiles(landObject, tiledLandObject, done);
    }

    function readTilesetFiles(landObject, tiledLandObject, done) {
      const tilesetFilePath =
        environment.basepathTiledTileset + '/abstractParcelTileset.json';

      const tiledTilesetArrayDeep = [];

      fs.readFile(tilesetFilePath, 'utf8', (error, tiledTilesetString) => {
        const tiledTilesetObject = JSON.parse(tiledTilesetString);

        // all tilesets .json files in tiled starts at 0, but on tilemap the numbers starts from 1 up
        // the tileset firstgid property in tilemap file tells what is the offset between tile id in tileset
        // and tile id in tilemap layer

        // find firstgid
        const tilesetName = tiledTilesetObject.name; // ex. 3x3
        let tiledFirstGid;
        tiledLandObject.tilesets.forEach((tilesetInfo) => {
          if (tilesetInfo.source.includes(tilesetName)) {
            tiledFirstGid = tilesetInfo.firstgid;
          }
        });

        debug('readTilesetFiles: name:', tiledTilesetObject.name);
        debug('readTilesetFiles: firstgid:', tiledFirstGid);

        const tiledTiles = toolConvertTilesetTileIndexes(
          tiledTilesetObject.tiles,
          tiledFirstGid
        );

        tiledTilesetArrayDeep.push(tiledTiles);
        const tiledTilesetArray = _.flatten(tiledTilesetArrayDeep);
        convertFromTiled(landObject, tiledLandObject, tiledTilesetArray, done);
      });
    }

    function convertFromTiled(
      landObject,
      tiledLandObject,
      tiledTilesetArray,
      done
    ) {
      // We convert tiled layer which is long array of numbers [0, 0, 0, 1, 0 ...] to two dimentional array of numbers

      const landLayersWithNumbers = {};
      tiledLandObject.layers.forEach((layer) => {
        landLayersWithNumbers[layer.name] = {};
        landLayersWithNumbers[layer.name].map = toolConvertTiledLayer(layer);
        landLayersWithNumbers[layer.name].name = layer.name;
      });

      // We convert tiled id of tile to its tile "value", that will become figureName
      const landLayerWithStringsObject = {};

      _.forEach(landLayersWithNumbers, (landLayer) => {
        try {
          landLayerWithStringsObject[
            landLayer.name
          ] = toolConvertNumbersToNames(landLayer.map, tiledTilesetArray);
        } catch (error) {
          errorArray.push(
            landObject.folderName + ': Errors in Tiled tiles: ' + error.message
          );
          done();
        }
      });

      // debug(
      //   'convertFromTiled: landLayerWithStringsObject:',
      //   landLayerWithStringsObject
      // );

      debug('convertFromTiled');
      generateAbstractParcelMap(landObject, landLayerWithStringsObject, done);
    }

    function generateAbstractParcelMap(
      landObject,
      landLayerWithStringsObject,
      done
    ) {
      const abstractParcelMap = [];

      landLayerWithStringsObject.mazeMap.forEach((row, rowY) => {
        abstractParcelMap[rowY] = [];
        row.forEach((tile, rowX) => {
          abstractParcelMap[rowY][rowX] = {};
        });
      });

      abstractParcelMap.forEach((abstractParcelMapRow, y) => {
        abstractParcelMapRow.forEach((abstractParcel, x) => {
          // debug('abstractParcelMap:', abstractParcelMap[0][0]);
          abstractParcelMap[y][x].category =
            landLayerWithStringsObject.categoryMap[y][x];
          abstractParcelMap[y][x].level =
            landLayerWithStringsObject.levelMap[y][x];
          abstractParcelMap[y][x].exits =
            landLayerWithStringsObject.mazeMap[y][x];
        });
      });

      landObject.abstractParcelMap = abstractParcelMap;
      debug('abstractParcelMap:', abstractParcelMap[0][0]);

      // debug('abstractParcelMap:', abstractParcelMap);
      insertLandObject(landObject, done);
    }

    function insertLandObject(landObject, done) {
      debug('insertLandObject: landObject:', landObject);
      db.collection('landCollection').insertOne(landObject, (error) => {
        if (error) {
          errorArray.push(
            landObject.folderName +
              ': ERROR: insert mongo error:' +
              JSON.stringify(error)
          );
        }

        debug('insertLandObject');
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

      _.times(height, () => {
        mapLayer.push([]);
      });

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

          if (!foundTiledTile.image) {
            throw new Error(
              'Tiled tile has no image defined: ' + foundTiledTile.image
            );
          }

          // find filename of image that corresponds to sprite name
          // foundTiledTile is like: ../public/sprite/tree.png
          const path = foundTiledTile.image;
          const pathSplitted = path.split('/');
          const filenameWithExtension = pathSplitted[pathSplitted.length - 1];
          const spriteName = filenameWithExtension.split('.png').join('');

          mapLayer[y][x] = spriteName;

          // debug('toolConvertNumbersToNames', y, x, mapLayer[y][x]);
        });
      });

      return mapLayer;
    }
  };
};
