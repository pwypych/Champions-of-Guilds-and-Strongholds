// @format

'use strict';

const debug = require('debug')('cogs:generateMapCollection');
const fs = require('fs');
const _ = require('lodash');

// Map base folder is in /tiledMap/ and has a folder for each map
// Map folder should have a name, f.ex "desert" and have two json files
// desert.json and desert_tileset.json inside, both saved from tiled
module.exports = (environment, db) => {
  return (callback) => {
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
      fs.readdir(environment.basepathTiledMap, (err, folderNameArray) => {
        debug('scanMapBaseFolder: folderNameArray:', folderNameArray);
        forEachFolderName(folderNameArray);
      });
    }

    function forEachFolderName(folderNameArray) {
      const done = _.after(folderNameArray.length, () => {
        debug('forEachFolderName: done!');
        afterForEach(folderNameArray.length);
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

      mapObject.pathTiledTileset =
        environment.basepathTiledMap +
        '/' +
        folderName +
        '/' +
        folderName +
        '_tileset.json';

      debug('instantiateMapObject: mapObject:', mapObject);
      checkTiledMapFileExists(mapObject, done);
    }

    function checkTiledMapFileExists(mapObject, done) {
      fs.stat(mapObject.pathTiledMap, (error, stats) => {
        if (error) {
          callback(
            'checkTiledMapFileExists: File does not exist, or other read error'
          );
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
        callback('parseJsonMapString: JSON parse error, not valid map file');
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
        callback('validateTiledMapObject: tiledMapObject missing layers array');
        return;
      }

      if (!Array.isArray(tiledMapObject.layers)) {
        callback('validateTiledMapObject: tiledMapObject.layers is not array');
        return;
      }

      mapObject.tiledMapObject = tiledMapObject;

      debug(
        'validateTiledMapObject: tiledMapObject.layers[0].data.length:',
        mapObject.tiledMapObject.layers[0].data.length
      );
      checkTiledTilesetFileExist(mapObject, done);
    }

    function checkTiledTilesetFileExist(mapObject, done) {
      fs.stat(mapObject.pathTiledTileset, (error, stats) => {
        if (error) {
          callback(
            'checkTiledTilesetFileExist: File does not exist, or other read error'
          );
          return;
        }

        debug('checkTiledTilesetFileExist: stats.size', stats.size);
        readTiledTilesetFile(mapObject, done);
      });
    }

    function readTiledTilesetFile(mapObject, done) {
      fs.readFile(
        mapObject.pathTiledTileset,
        'utf8',
        (error, tiledTilesetString) => {
          debug('readTiledTilesetFile', tiledTilesetString.length);
          parseJsonTilesetString(mapObject, tiledTilesetString, done);
        }
      );
    }

    function parseJsonTilesetString(mapObject, tiledTilesetString, done) {
      let tiledTilesetObject;
      try {
        tiledTilesetObject = JSON.parse(tiledTilesetString);
      } catch (error) {
        callback(
          'parseJsonTilesetString: JSON parse error, not valid tileset file'
        );
        return;
      }

      debug('parseJsonTilesetString');
      validateTilesetObject(mapObject, tiledTilesetObject, done);
    }

    function validateTilesetObject(mapObject, tiledTilesetObject, done) {
      if (!tiledTilesetObject.tiles) {
        callback('validateMap: TileObject missing tiles array');
        return;
      }

      if (!tiledTilesetObject.tiles[0].properties[0].value) {
        callback(
          'validateTilesetObject: tiledTilesetObject.tiles[0].properties[0].value is not exist'
        );
        return;
      }

      mapObject.tiledTilesetObject = tiledTilesetObject;

      debug(
        'validateTilesetObject: tiledTilesetObject.tiles.length:',
        mapObject.tiledTilesetObject.tiles.length
      );
      insertMapObject(mapObject, done);
    }

    function insertMapObject(mapObject, done) {
      db.collection('mapCollection').insertOne(mapObject, (error) => {
        if (error) {
          callback('ERROR: insert mongo error:', error);
          return;
        }

        debug('insertMapObject');
        done();
      });
    }

    function afterForEach(loadedMapCount) {
      debug('afterForEach');
      callback(null, loadedMapCount);
    }
  };
};
