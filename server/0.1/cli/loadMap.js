// @format

'use strict';

// Libraries
const fs = require('fs');
const mongodb = require('mongodb').MongoClient;

// Variables
let db;
let mapFilePath;
let mapObject;

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
  checkFileExists();
}

function checkFileExists() {
  fs.stat(mapFilePath, (error, stats) => {
    if (error) {
      console.error(
        'ERROR: checkFileExists: File does not exist, or other read error'
      );
      process.exit(1);
    }

    console.log('checkFileExists');
    readFile();
  });
}

function readFile() {
  fs.readFile(mapFilePath, 'utf8', (error, mapString) => {
    console.log('readFile', mapString.length);
    parseJson(mapString);
  });
}

function parseJson(mapString) {
  try {
    mapObject = JSON.parse(mapString);
  } catch (error) {
    console.error('ERROR: parseJson: JSON parse error, not valid map file');
    process.exit(1);
  }

  console.log('parseJson');
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
  setupMongo();
}

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
      process.exit(0);
    }
  );
}
