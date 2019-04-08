// @format

'use strict';

const debug = require('debug')('cogs:generateParcelCollection');
const fs = require('fs');
const _ = require('lodash');

// Map base folder is in /tiledMap/ and has a folder for each map
// Map folder should have a name, f.ex "desert" and jsonfile desert.json
// We need tileset files in /tiledTileset/ folder

// @todo
// refactor names, tool functions should be located in waterfall
module.exports = (environment, db) => {
  return (callback) => {
    const errorArray = [];

    (function init() {
      debug('// Reloads tiled parcels files into database');

      dropParcelCollection();
    })();

    function dropParcelCollection() {
      db.collection('parcelCollection').drop((error) => {
        if (error) {
          // When no map collection this error is thrown, ignore it
          if (error.message !== 'ns not found') {
            callback('remove mongo error:' + JSON.stringify(error));
            return;
          }
        }

        debug('dropParcelCollection - success!');

        scanParcelBaseFolder();
      });
    }

    function scanParcelBaseFolder() {
      fs.readdir(environment.basepathTiledParcel, (error, folderNameArray) => {
        debug('scanParcelBaseFolder: folderNameArray:', folderNameArray);
        forEachParcelCategoryFolder(folderNameArray);
      });
    }

    // Parcel category folders  => castle, treasure
    function forEachParcelCategoryFolder(folderNameArray) {
      const done = _.after(folderNameArray.length, () => {
        debug('forEachParcelCategoryFolder: done!');
        checkForEachErrorArray(folderNameArray.length);
      });

      folderNameArray.forEach((folderParcelCategory) => {
        debug('forEachParcelCategoryFolder', folderParcelCategory);
        scanParcelCategoryFolder(folderParcelCategory, done);
      });
    }

    function scanParcelCategoryFolder(folderParcelCategory, done) {
      const pathParcelCategory =
        environment.basepathTiledParcel + '/' + folderParcelCategory;
      fs.readdir(pathParcelCategory, (error, parcelTypeArray) => {
        debug('scanParcelBaseFolder: folderNameArray:', parcelTypeArray);
        forEachParcelTypeFolder(parcelTypeArray, done);
      });
    }

    // Parcel type folders  => oooo, zzzo, zozo, ... (15)
    function forEachParcelTypeFolder(folderParcelCategory) {
      const done = _.after(folderParcelCategory.length, () => {
        debug('forEachParcelTypeFolder: done!');
        checkForEachErrorArray(folderParcelCategory.length);
      });

      folderParcelCategory.forEach((folderName) => {
        debug('forEachParcelTypeFolder', folderName);
        instantiateMapObject(folderName, done);
      });
    }

    function instantiateMapObject(folderName, done) {
      const parcelObject = {};
      parcelObject._id = folderName;
      parcelObject.folderName = folderName;

      parcelObject.pathTiledMap =
        environment.basepathTiledMap +
        '/' +
        folderName +
        '/' +
        folderName +
        '.json';

      debug('instantiateMapObject: parcelObject:', parcelObject);
      done();
      // callback(null, 5);
      // checkTiledParcelFileExists(parcelObject, done);
    }

    function checkTiledParcelFileExists(parcelObject, done) {
      fs.stat(parcelObject.pathTiledMap, (error, stats) => {
        if (error) {
          errorArray.push(
            parcelObject.folderName +
              ': checkTiledParcelFileExists: File does not exist, or other read error'
          );
          done();
          return;
        }

        debug('checkTiledParcelFileExists: stats.size', stats.size);
        readTiledMapFile(parcelObject, done);
      });
    }

    function readTiledMapFile(parcelObject, done) {
      fs.readFile(
        parcelObject.pathTiledMap,
        'utf8',
        (error, tiledMapString) => {
          debug('readTiledMapFile', tiledMapString.length);
          parseJsonMapString(parcelObject, tiledMapString, done);
        }
      );
    }

    function parseJsonMapString(parcelObject, tiledMapString, done) {
      let tiledMapObject;
      try {
        tiledMapObject = JSON.parse(tiledMapString);
      } catch (error) {
        errorArray.push(
          parcelObject.folderName +
            ': parseJsonMapString: JSON parse error, not valid map file'
        );
        done();
        return;
      }

      debug(
        'parseJsonMapString: parcelObject.tiledMapObject.height:',
        tiledMapObject.height
      );
      validateTiledMapObject(parcelObject, tiledMapObject, done);
    }

    function validateTiledMapObject(parcelObject, tiledMapObject, done) {
      if (!tiledMapObject.layers) {
        errorArray.push(
          parcelObject.folderName +
            ': validateTiledMapObject: tiledMapObject missing layers array'
        );
        done();
        return;
      }

      if (!Array.isArray(tiledMapObject.layers)) {
        errorArray.push(
          parcelObject.folderName +
            ': validateTiledMapObject: tiledMapObject.layers is not array'
        );
        done();
        return;
      }

      debug(
        'validateTiledMapObject: tiledMapObject.layers[0].data.length:',
        tiledMapObject.layers[0].data.length
      );
      readTilesetFiles(parcelObject, tiledMapObject, done);
    }

    function readTilesetFiles(parcelObject, tiledMapObject, done) {
      const filePathArray = [
        environment.basepathTiledTileset + '/1x1.json',
        environment.basepathTiledTileset + '/3x3.json'
      ];
      const tiledTilesetArrayDeep = [];

      const doneTilesets = _.after(filePathArray.length, () => {
        const tiledTilesetArray = _.flatten(tiledTilesetArrayDeep);
        debug('readTilesetFiles', tiledTilesetArray);
        convertFromTiled(parcelObject, tiledMapObject, tiledTilesetArray, done);
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
      parcelObject,
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
          parcelObject.folderName + ': Errors in Tiled tiles: ' + error.message
        );
        done();
        return;
      }

      debug(
        'convertFromTiled:mapLayer:',
        JSON.stringify(mapLayerWithStrings).slice(0, 50)
      );

      debug('convertFromTiled');
      parcelObject.mapLayerWithStrings = mapLayerWithStrings;

      insertMapObject(parcelObject, done);
    }

    function insertMapObject(parcelObject, done) {
      db.collection('mapCollection').insertOne(parcelObject, (error) => {
        if (error) {
          errorArray.push(
            parcelObject.folderName +
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
