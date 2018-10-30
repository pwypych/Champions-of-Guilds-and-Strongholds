// @format

'use strict';

const debug = require('debug')('cogs:generateMapCollection');
const fs = require('fs');
const path = require('path');

module.exports = (environment, db) => {
  let mapFilePaths = [];
  let mapObject;
  let mapDir;

  let tilesetPath;
  let tilesetObject;

  return (callback) => {
    (function init() {
      debug('init');
      scanMapFolder();
    })();

    function scanMapFolder() {
      debug('environment', environment);
      mapDir = environment.basepath + '/tiledMap';
      debug('mapDir', mapDir);

      fs.readdir(mapDir, (err, files) => {
        debug('scanMapFolder', files);
        generateMapFilePaths(files);
      });
    }

    function generateMapFilePaths(foldersArray) {
      foldersArray.forEach((folderName) => {
        const name = mapDir + '/' + folderName + '/' + folderName + '.json';
        mapFilePaths.push(name);
      });

      debug('generateMapFilePaths', mapFilePaths);
      parseArguments();
    }

    function parseArguments() {
      const mapFilePath = mapFilePaths[0];

      if (!mapFilePath) {
        callback(
          'parseArguments: First argument must be valid path to map JSON'
        );
        return;
      }

      debug('parseArguments', mapFilePath);
      checkFileMapExists();
    }

    function checkFileMapExists() {
      fs.stat(mapFilePaths[0], (error, stats) => {
        if (error) {
          callback(
            'checkFileMapExists: File does not exist, or other read error'
          );
          return;
        }

        debug('checkFileMapExists: stats.size', stats.size);
        readFileMap();
      });
    }

    function readFileMap() {
      fs.readFile(mapFilePaths[0], 'utf8', (error, mapString) => {
        debug('readFileMap', mapString.length);
        parseJsonMap(mapString);
      });
    }

    function parseJsonMap(mapString) {
      try {
        mapObject = JSON.parse(mapString);
      } catch (error) {
        callback('parseJsonMap: JSON parse error, not valid map file');
        return;
      }

      debug('parseJsonMap', mapObject.height);
      validateMap();
    }

    function validateMap() {
      if (!mapObject.layers) {
        callback('validateMap: mapObject missing layers array');
        return;
      }

      if (!Array.isArray(mapObject.layers)) {
        callback('validateMap: mapObject.layers is not array');
        return;
      }

      debug('validateMap', mapObject.layers[0].data.length);
      generateTilesetPath();
    }

    function generateTilesetPath() {
      const mapName = path.basename(mapFilePaths[0], '.json');
      debug('mapName', mapName);
      const directoryName = path.dirname(mapFilePaths[0]);
      debug('directoryName', directoryName);

      tilesetPath = path.join(directoryName, mapName + '_tileset.json');
      debug('tilesetPath', tilesetPath);
      checkFileTilesetExist();
    }

    function checkFileTilesetExist() {
      fs.stat(tilesetPath, (error, stats) => {
        if (error) {
          callback(
            'checkFileTilesetExist: File does not exist, or other read error'
          );
          return;
        }
        debug('checkFileTilesetExist: stats.size', stats.size);

        debug('checkFileTilesetExist', stats.size);
        readFileTileset();
      });
    }

    function readFileTileset() {
      fs.readFile(tilesetPath, 'utf8', (error, tilesetString) => {
        debug('readFileTileset', tilesetString.length);
        parseJsonTileset(tilesetString);
      });
    }

    function parseJsonTileset(tilesetString) {
      try {
        tilesetObject = JSON.parse(tilesetString);
      } catch (error) {
        callback('parseJsonTileset: JSON parse error, not valid tileset file');
        return;
      }

      debug('parseJsonTileset');
      validateTileset();
    }

    function validateTileset() {
      if (!tilesetObject.tiles) {
        callback('validateMap: TileObject missing tiles array');
        return;
      }

      if (!tilesetObject.tiles[0].properties[0].value) {
        callback(
          'validateTileset: tilesetObject.tiles[0].properties[0].value is not exist'
        );
        return;
      }

      debug('validateTileset', tilesetObject.tiles.length);
      dropMapCollection();
    }

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
        insertMapObject();
      });
    }

    function insertMapObject() {
      const mapName = path.basename(mapFilePaths[0], '.json');

      mapObject._id = mapName;
      mapObject.tilesetObject = tilesetObject;

      db.collection('mapCollection').insertOne(mapObject, (error) => {
        if (error) {
          callback('ERROR: insert mongo error:', error);
          return;
        }

        debug('insertMapObject');
        callback(null);
      });
    }
  };
};
