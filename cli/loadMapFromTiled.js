// @format

'use strict';

/*

  # Usage

  >node loadMapFromTiled.js ~/node/cogs/_/map/forest/forest.json

  !NB There should be tileset file in directory named forest_tileset.json

*/

// Libraries
const fs = require('fs');
const path = require('path');
const mongodb = require('mongodb').MongoClient;

// Variables
let db;

let mapFilePath;
let mapObject;

let tilesetPath;
let tilesetObject;

/* eslint-disable no-console */
(function init() {
  parseArguments();
  console.log('init');
})();

function parseArguments() {
  mapFilePath = process.argv[2];

  if (!mapFilePath) {
    console.error(
      'ERROR: parseArguments: First argument must be valid path to map JSON'
    );
    process.exit(1);
  }

  console.log('parseArguments', mapFilePath);
  checkFileMapExists();
}

// ---------- ex. forest.json ----------

function checkFileMapExists() {
  fs.stat(mapFilePath, (error, stats) => {
    if (error) {
      console.error(
        'ERROR: checkFileMapExists: File does not exist, or other read error'
      );
      process.exit(1);
    }

    console.log('checkFileMapExists: stats.size', stats.size);
    readFileMap();
  });
}

function readFileMap() {
  fs.readFile(mapFilePath, 'utf8', (error, mapString) => {
    console.log('readFileMap', mapString.length);
    parseJsonMap(mapString);
  });
}

function parseJsonMap(mapString) {
  try {
    mapObject = JSON.parse(mapString);
  } catch (error) {
    console.error('ERROR: parseJsonMap: JSON parse error, not valid map file');
    process.exit(1);
  }

  console.log('parseJsonMap');
  validateMap();
}

function validateMap() {
  if (!mapObject.layers) {
    console.error('ERROR: validateMap: mapObject missing layers array');
    process.exit(1);
  }

  if (!Array.isArray(mapObject.layers)) {
    console.error('ERROR: validateMap: mapObject.layers is not array');
    process.exit(1);
  }

  console.log('validateMap', mapObject.layers[0].data.length);
  generateTilesetPath();
}

// ---------- ex. forest_tileset.json ----------

function generateTilesetPath() {
  const mapName = path.basename(mapFilePath, '.json');
  const directoryName = path.dirname(mapFilePath);

  tilesetPath = path.join(directoryName, mapName + '_tileset.json');
  checkFileTilesetExist();
}

function checkFileTilesetExist() {
  fs.stat(tilesetPath, (error, stats) => {
    if (error) {
      console.error(
        'ERROR: checkFileTilesetExist: File does not exist, or other read error'
      );
      process.exit(1);
    }
    console.log('checkFileTilesetExist: stats.size', stats.size);
    readFileTileset();
  });
}

function readFileTileset() {
  fs.readFile(tilesetPath, 'utf8', (error, tilesetString) => {
    console.log('readFileTileset', tilesetString.length);
    parseJsonTileset(tilesetString);
  });
}

function parseJsonTileset(tilesetString) {
  try {
    tilesetObject = JSON.parse(tilesetString);
  } catch (error) {
    console.error(
      'ERROR: parseJsonTileset: JSON parse error, not valid tileset file'
    );
    process.exit(1);
  }

  console.log('parseJsonTileset');
  validateTileset();
}

function validateTileset() {
  if (!tilesetObject.tiles) {
    console.error('ERROR: validateMap: TileObject missing tiles array');
    process.exit(1);
  }

  if (!tilesetObject.tiles[0].properties[0].value) {
    console.error(
      'ERROR: validateTileset: tilesetObject.tiles[0].properties[0].value is not exist'
    );
    process.exit(1);
  }

  console.log('validateTileset', tilesetObject.tiles.length);
  setupMongo();
}

// ---------- Database ----------

function setupMongo() {
  const connectionUrl = 'mongodb://localhost:27017';
  const dbName = 'cogs_0_1';
  const options = {
    useNewUrlParser: true
  };

  mongodb.connect(
    connectionUrl,
    options,
    (error, client) => {
      db = client.db(dbName);

      console.log('setupMongo()');
      removeMapObject();
    }
  );
}
function removeMapObject() {
  const mapName = path.basename(mapFilePath, '.json');

  db.collection('mapCollection').removeOne({ _id: mapName }, (error) => {
    if (error) {
      console.error('ERROR: remove mongo error:', error);
      process.exit(1);
    }

    console.log('removeMapObject');
    insertMapObject();
  });
}

function insertMapObject() {
  const mapName = path.basename(mapFilePath, '.json');

  mapObject._id = mapName;
  mapObject.tilesetObject = tilesetObject;

  db.collection('mapCollection').insertOne(mapObject, (error) => {
    if (error) {
      console.error('ERROR: insert mongo error:', error);
      process.exit(1);
    }

    console.log('insertMapObject');
    console.log('processExit: SUCCESS');
    process.exit(0);
  });
}
