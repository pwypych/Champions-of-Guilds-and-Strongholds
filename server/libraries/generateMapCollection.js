// @format

'use strict';

const debug = require('debug')('cogs:generateMapCollection');
const fs = require('fs');
const path = require('path');

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
      const mapBaseFolderPath = environment.basepath + '/tiledMap';

      fs.readdir(mapBaseFolderPath, (err, folderArray) => {
        debug('scanMapBaseFolder: folderArray:', folderArray);
        generateMapFilePathArray(folderArray, mapBaseFolderPath);
      });
    }

    function generateMapFilePathArray(folderArray, mapBaseFolderPath) {
      const mapFilePathArray = [];

      folderArray.forEach((folderName) => {
        const mapFilePath =
          mapBaseFolderPath + '/' + folderName + '/' + folderName + '.json';
        mapFilePathArray.push(mapFilePath);
      });

      debug('generateMapFilePathArray: mapFilePathArray:', mapFilePathArray);
      forEachMapFilePath(mapFilePathArray);
    }

    function forEachMapFilePath(mapFilePathArray) {
      const mapFilePath = mapFilePathArray[0];

      debug('forEachMapFilePath', mapFilePath);
      checkMapFileExists(mapFilePath);
    }

    function checkMapFileExists(mapFilePath) {
      fs.stat(mapFilePath, (error, stats) => {
        if (error) {
          callback(
            'checkMapFileExists: File does not exist, or other read error'
          );
          return;
        }

        debug('checkMapFileExists: stats.size', stats.size);
        readMapFile(mapFilePath);
      });
    }

    function readMapFile(mapFilePath) {
      fs.readFile(mapFilePath, 'utf8', (error, mapString) => {
        debug('readMapFile', mapString.length);
        parseJsonMapString(mapFilePath, mapString);
      });
    }

    function parseJsonMapString(mapFilePath, mapString) {
      let mapObject;
      try {
        mapObject = JSON.parse(mapString);
      } catch (error) {
        callback('parseJsonMapString: JSON parse error, not valid map file');
        return;
      }

      debug('parseJsonMapString', mapObject.height);
      validateMapObject(mapFilePath, mapObject);
    }

    function validateMapObject(mapFilePath, mapObject) {
      if (!mapObject.layers) {
        callback('validateMapObject: mapObject missing layers array');
        return;
      }

      if (!Array.isArray(mapObject.layers)) {
        callback('validateMapObject: mapObject.layers is not array');
        return;
      }

      debug('validateMapObject', mapObject.layers[0].data.length);
      updateMapObjectWithMapId(mapFilePath, mapObject);
    }

    function updateMapObjectWithMapId(mapFilePath, mapObject) {
      mapObject._id = path.basename(mapFilePath, '.json');

      debug('updateMapObjectWithMapId: mapObject._id', mapObject._id);
      generateTilesetPath(mapFilePath, mapObject);
    }

    function generateTilesetPath(mapFilePath, mapObject) {
      const mapFolderPath = path.dirname(mapFilePath);
      debug('generateTilesetPath: mapFolderPath:', mapFolderPath);

      const tilesetFilePath = path.join(
        mapFolderPath,
        mapObject._id + '_tileset.json'
      );
      debug('generateTilesetPath: tilesetFilePath:', tilesetFilePath);
      checkTilesetFileExist(mapObject, tilesetFilePath);
    }

    function checkTilesetFileExist(mapObject, tilesetFilePath) {
      fs.stat(tilesetFilePath, (error, stats) => {
        if (error) {
          callback(
            'checkTilesetFileExist: File does not exist, or other read error'
          );
          return;
        }

        debug('checkTilesetFileExist: stats.size', stats.size);
        readTilesetFile(mapObject, tilesetFilePath);
      });
    }

    function readTilesetFile(mapObject, tilesetFilePath) {
      fs.readFile(tilesetFilePath, 'utf8', (error, tilesetString) => {
        debug('readTilesetFile', tilesetString.length);
        parseJsonTilesetString(mapObject, tilesetString);
      });
    }

    function parseJsonTilesetString(mapObject, tilesetString) {
      let tilesetObject;
      try {
        tilesetObject = JSON.parse(tilesetString);
      } catch (error) {
        callback(
          'parseJsonTilesetString: JSON parse error, not valid tileset file'
        );
        return;
      }

      debug('parseJsonTilesetString');
      validateTilesetObject(mapObject, tilesetObject);
    }

    function validateTilesetObject(mapObject, tilesetObject) {
      if (!tilesetObject.tiles) {
        callback('validateMap: TileObject missing tiles array');
        return;
      }

      if (!tilesetObject.tiles[0].properties[0].value) {
        callback(
          'validateTilesetObject: tilesetObject.tiles[0].properties[0].value is not exist'
        );
        return;
      }

      debug(
        'validateTilesetObject: tilesetObject.tiles.length:',
        tilesetObject.tiles.length
      );
      updateMapObjectWithTileset(mapObject, tilesetObject);
    }

    function updateMapObjectWithTileset(mapObject, tilesetObject) {
      mapObject.tilesetObject = tilesetObject;

      debug('updateMapObjectWithTileset');
      insertMapObject(mapObject);
    }

    function insertMapObject(mapObject) {
      db.collection('mapCollection').insertOne(mapObject, (error) => {
        if (error) {
          callback('ERROR: insert mongo error:', error);
          return;
        }

        debug('insertMapObject');
        callback(null, 1);
      });
    }
  };
};
