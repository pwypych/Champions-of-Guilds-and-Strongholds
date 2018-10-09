// @format

'use strict';

const debug = require('debug')('cogs:createGamePost');
const shortid = require('shortid');

module.exports = (environment, sanitizer, db) => {
  return (req, res) => {
    const viewModel = {};
    viewModel.baseurl = environment.baseurl;

    (function init() {
      debug('init');
      sanitizeMapName();
    })();

    function sanitizeMapName() {
      if (!req.body.mapName) {
        debug('sanitizeMapName: error: ', req.body);
        res.status(503).send('503 Error - Wrong POST parameter');
        return;
      }

      const mapName = sanitizer.sanitizeMapName(req.body.mapName);
      debug('sanitizeMapName', mapName);
      findMap(mapName);
    }

    function findMap(mapName) {
      const query = { _id: mapName };
      const options = {};

      db.collection('maps').findOne(query, options, (error, mapObject) => {
        if (error) {
          debug('findMap: error:', error);
          res.status(503).send('503 Error - Cannot find map');
          return;
        }

        debug('findMap', mapObject._id);
        prepareGameInstance(mapObject);
      });
    }

    function prepareGameInstance(mapObject) {
      const gameInstance = {};

      gameInstance._id = shortid.generate();

      gameInstance.mapName = mapObject._id;
      gameInstance.mapLayer = toolConvertTiledLayer(mapObject.layers[0]);

      gameInstance.players = [];

      const playerOne = {};
      playerOne.token = shortid.generate();
      playerOne.name = 'Player 1';
      gameInstance.players.push(playerOne);

      const playerTwo = {};
      playerTwo.token = shortid.generate();
      playerTwo.name = 'Player 2';
      gameInstance.players.push(playerTwo);

      // debug('gameInstance.mapLayer: %o', gameInstance.mapLayer);
      debug('prepareGameInstance', gameInstance._id);
      insertGameInstance(gameInstance);
    }

    function insertGameInstance(gameInstance) {
      db.collection('games').insertOne(gameInstance, (error) => {
        if (error) {
          debug('insertGameInstance: error:', error);
          res.status(503).send('503 Error - Cannot insert game instance');
        }

        debug('insertGameInstance');
        sendResponce(gameInstance.mapName);
      });
    }

    function sendResponce(mapName) {
      debug('sendResponce()');
      debug('******************** should redirect ********************');
      res.send('loaded map: ' + mapName);
    }

    function toolConvertTiledLayer(tiledLayer) {
      const data = tiledLayer.data;
      const height = tiledLayer.height;
      const width = tiledLayer.width;

      const mapLayer = [];

      for (let i = 0; i < height; i += 1) {
        mapLayer.push([]);
      }

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
  };
};
