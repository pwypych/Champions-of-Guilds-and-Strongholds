'use strict';

// Libraries
const fs = require('fs');
const mongodb = require('mongodb').MongoClient;

// Variables
let db;

(function init() {
  setupMongo();
})();

function setupMongo() {
  const connectionUrl = 'mongodb://localhost:27017';
  const dbName = 'cogs';
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
