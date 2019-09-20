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
          // When no parcel collection this error is thrown, ignore it
          if (error.message !== 'ns not found') {
            callback('remove mongo error:' + JSON.stringify(error));
            return;
          }
        }

        debug('dropParcelCollection - success!');

        tilesetFilesRead();
      });
    }

    function tilesetFilesRead() {
      const filePathArray = [
        environment.basepathTiledTileset + '/1x1.json',
        environment.basepathTiledTileset + '/3x3.json',
        environment.basepathTiledTileset + '/abstractFigureTileset.json'
      ];
      const tiledTilesetArrayDeep = [];

      const doneTilesets = _.after(filePathArray.length, () => {
        const tiledTilesetArray = _.flatten(tiledTilesetArrayDeep);

        debug(
          'tilesetFilesRead: tiledTilesetArray.length:',
          tiledTilesetArray.length
        );
        scanParcelBaseFolder(tiledTilesetArray);
      });

      filePathArray.forEach((filepath) => {
        fs.readFile(filepath, 'utf8', (error, tiledTilesetString) => {
          const tiledTilesetObject = JSON.parse(tiledTilesetString);
          debug(
            'tilesetFilesRead: tiledTilesetObject.name:',
            tiledTilesetObject.name
          );
          tiledTilesetArrayDeep.push(tiledTilesetObject);
          doneTilesets();
        });
      });
    }

    function scanParcelBaseFolder(tiledTilesetArray) {
      fs.readdir(environment.basepathTiledParcel, (error, folderNameArray) => {
        debug(
          'scanParcelBaseFolder: folderNameArray.length:',
          folderNameArray.length
        );
        forEachParcel(folderNameArray, tiledTilesetArray);
      });
    }

    // Parcel category folders  => castle, treasure
    function forEachParcel(folderNameArray) {
      const done = _.after(folderNameArray.length, () => {
        debug('forEachParcel: done!');
        checkForEachErrorArray(folderNameArray.length);
      });

      folderNameArray.forEach((parcel) => {
        // debug('forEachParcel', parcel);
        splitParcelFileName(parcel, done);
      });
    }

    function splitParcelFileName(parcelWithExtension, done) {
      const parcel = parcelWithExtension.substring(
        0,
        parcelWithExtension.length - 5
      );
      const parcelSplitArray = parcel.split('_');
      // debug('splitParcelFileName: parcelSplitArray:', parcelSplitArray);
      instantiateParcelObject(
        parcelSplitArray,
        parcelWithExtension,
        parcel,
        done
      );
    }

    function instantiateParcelObject(
      parcelSplitArray,
      parcelWithExtension,
      parcel,
      done
    ) {
      const parcelObject = {};
      parcelObject._id = parcel;
      parcelObject.category = parcelSplitArray[0];
      parcelObject.exits = parcelSplitArray[1];
      parcelObject.name = parcelSplitArray[2];

      parcelObject.pathTiledParcel =
        environment.basepathTiledParcel + '/' + parcelWithExtension;

      // debug('instantiateParcelObject: parcelObject:', parcelObject);
      checkTiledParcelFileExists(parcelObject, done);
    }

    function checkTiledParcelFileExists(parcelObject, done) {
      fs.stat(parcelObject.pathTiledParcel, (error) => {
        if (error) {
          errorArray.push(
            parcelObject.folderName +
              ': checkTiledParcelFileExists: File does not exist, or other read error'
          );
          done();
          return;
        }

        // debug('checkTiledParcelFileExists: stats.size', stats.size);
        readTiledParcelFile(parcelObject, done);
      });
    }

    function readTiledParcelFile(parcelObject, done) {
      fs.readFile(
        parcelObject.pathTiledParcel,
        'utf8',
        (error, tiledParcelString) => {
          // debug('readTiledParcelFile', tiledParcelString.length);
          parseJsonParcelString(parcelObject, tiledParcelString, done);
        }
      );
    }

    function parseJsonParcelString(parcelObject, tiledParcelString, done) {
      let tiledParcelObject;
      try {
        tiledParcelObject = JSON.parse(tiledParcelString);
      } catch (error) {
        debug('parseJsonParcelString: JSON parse error, not valid map file!');
        errorArray.push(
          parcelObject.folderName +
            ': parseJsonParcelString: JSON parse error, not valid map file'
        );
        done();
        return;
      }

      // debug(
      //   'parseJsonParcelString: parcelObject.tiledParcelObject.height:',
      //   tiledParcelObject.height
      // );
      validateTiledParcelObject(parcelObject, tiledParcelObject, done);
    }

    function validateTiledParcelObject(parcelObject, tiledParcelObject, done) {
      if (!tiledParcelObject.layers) {
        debug('parseJsonParcelString: tiledParcelObject missing layers array!');
        errorArray.push(
          parcelObject.folderName +
            ': validateTiledParcelObject: tiledParcelObject missing layers array'
        );
        done();
        return;
      }

      if (!Array.isArray(tiledParcelObject.layers)) {
        debug('parseJsonParcelString: tiledParcelObject.layers is not array!');
        errorArray.push(
          parcelObject.folderName +
            ': validateTiledParcelObject: tiledParcelObject.layers is not array'
        );
        done();
        return;
      }

      // debug(
      //   'validateTiledParcelObject: tiledParcelObject.layers[0].data.length:',
      //   tiledParcelObject.layers[0].data.length
      // );
      readTilesetFiles(parcelObject, tiledParcelObject, done);
    }

    function readTilesetFiles(parcelObject, tiledParcelObject, done) {
      const filePathArray = [
        environment.basepathTiledTileset + '/1x1.json',
        environment.basepathTiledTileset + '/3x3.json',
        environment.basepathTiledTileset + '/abstractFigureTileset.json'
      ];
      const tiledTilesetArrayDeep = [];

      const doneTilesets = _.after(filePathArray.length, () => {
        const tiledTilesetArray = _.flatten(tiledTilesetArrayDeep);
        // debug('readTilesetFiles', tiledTilesetArray);
        convertFromTiled(
          parcelObject,
          tiledParcelObject,
          tiledTilesetArray,
          done
        );
      });

      filePathArray.forEach((filepath) => {
        fs.readFile(filepath, 'utf8', (error, tiledTilesetString) => {
          const tiledTilesetObject = JSON.parse(tiledTilesetString);
          // debug('readTilesetFiles: tiledTilesetObject:', tiledTilesetObject);

          // all tilesets .json files in tiled starts at 0, but on tilemap the numbers starts from 1 up
          // the tileset firstgid property in tilemap file tells what is the offset between tile id in tileset
          // and tile id in tilemap layer

          // find firstgid
          const tilesetName = tiledTilesetObject.name; // ex. 3x3
          let tiledFirstGid;
          tiledParcelObject.tilesets.forEach((tilesetInfo) => {
            if (tilesetInfo.source.includes(tilesetName)) {
              tiledFirstGid = tilesetInfo.firstgid;
            }
          });

          // debug('readTilesetFiles: name:', tiledTilesetObject.name);
          // debug('readTilesetFiles: filepath:', filepath);
          // debug('readTilesetFiles: firstgid:', tiledFirstGid);

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
      tiledParcelObject,
      tiledTilesetArray,
      done
    ) {
      // We convert tiled layer which is long array of numbers [0, 0, 0, 1, 0 ...] to two dimentional array of numbers
      const parcelLayerWithNumbers = toolConvertTiledLayer(
        tiledParcelObject.layers[0]
      );
      // debug(
      //   'convertFromTiled:parcelLayerWithNumbers:',
      //   JSON.stringify(parcelLayerWithNumbers).slice(0, 50)
      // );

      // We convert tiled id of tile to its tile "value", that will become figureName
      let parcelLayerWithStrings;

      try {
        parcelLayerWithStrings = toolConvertNumbersToNames(
          parcelLayerWithNumbers,
          tiledTilesetArray
        );
      } catch (error) {
        debug('convertFromTiled: Errors in Tiled tiles!');
        errorArray.push(
          parcelObject.folderName + ': Errors in Tiled tiles: ' + error.message
        );
        done();
        return;
      }

      // debug(
      //   'convertFromTiled:mapLayer:',
      //   JSON.stringify(parcelLayerWithStrings).slice(0, 50)
      // );

      parcelObject.parcelLayerWithStrings = parcelLayerWithStrings;

      insertParcelObject(parcelObject, done);
    }

    function insertParcelObject(parcelObject, done) {
      db.collection('parcelCollection').insertOne(parcelObject, (error) => {
        if (error) {
          debug('insertParcelObject: Insert mongo error!');
          errorArray.push(
            parcelObject.folderName +
              ': ERROR: insert mongo error:' +
              JSON.stringify(error)
          );
        }

        debug('insertParcelObject: parcelObject._id:', parcelObject._id);
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
