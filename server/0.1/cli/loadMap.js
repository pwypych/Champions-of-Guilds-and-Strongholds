// @format

'use strict';

// Libraries
const fs = require('fs');
const mongodb = require('mongodb').MongoClient;

// Variables
let db;
let mapPath;

(function init() {
  parseArguments();
  console.log('init');
})();

function parseArguments() {
  mapPath = process.argv[2];

  if (!mapPath) {
    console.error(
      'parseArguments: First argument must be valid path to map JSON'
    );
    process.exit(1);
  }

  console.log('parseArguments', mapPath);
  checkFileExists();
}

function checkFileExists() {
  console.log('checkFileExists');
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
