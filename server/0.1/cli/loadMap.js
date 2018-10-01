// @format

'use strict';

// Libraries
const fs = require('fs');
const mongodb = require('mongodb').MongoClient;

// Variables
let db;
let mapFilePath;

/* eslint-disable no-console */
(function init() {
  parseArguments();
  console.log('init');
})();

function parseArguments() {
  mapFilePath = process.argv[2];

  if (!mapFilePath) {
    console.error(
      'parseArguments: First argument must be valid path to map JSON'
    );
    process.exit(1);
  }

  console.log('parseArguments', mapFilePath);
  checkFileExists();
}

function checkFileExists() {
  fs.stat(mapFilePath, (error, stats) => {
    if (error) {
      console.error('checkFileExists:', error);
      process.exit(1);
    }

    console.log('checkFileExists', stats);
    setupMongo();
  });
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
