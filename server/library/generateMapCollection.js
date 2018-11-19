// @format

'use strict';

const debug = require('debug')('nope:cogs:generateMapCollection');
const fs = require('fs');
const _ = require('lodash');

// Map base folder is in /tiledMap/ and has a folder for each map
// Map folder should have a name, f.ex "desert" and have two json files
// desert.json and desert_tileset.json inside, both saved from tiled
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

      mapObject.tiledMapObject = tiledMapObject;

      debug(
        'validateTiledMapObject: tiledMapObject.layers[0].data.length:',
        mapObject.tiledMapObject.layers[0].data.length
      );
      insertMapObject(mapObject, done);
    }

    function insertMapObject(mapObject, done) {
      db.collection('mapCollection').insertOne(mapObject, (error) => {
        if (error) {
          errorArray.push(
            mapObject.folderName + ': ERROR: insert mongo error:',
            error
          );
          done();
          return;
        }

        debug('insertMapObject');
        done();
      });
    }

    function afterForEach(loadedMapCount) {
      debug('afterForEach');
      if (!_.isEmpty(errorArray)) {
        callback('\n ' + errorArray.join(' \n '));
        return;
      }

      callback(null, loadedMapCount);
    }
  };
};
