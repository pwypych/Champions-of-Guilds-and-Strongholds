// @format

'use strict';

const debug = require('debug')('cogs:createGameInstancePost');
const shortid = require('shortid');

module.exports = (environment, sanitizer, db) => {
  return (req, res) => {
    (function init() {
      debug('init');
      checkRequestBody();
    })();

    function checkRequestBody() {
      if (!req.body.mapName) {
        debug('checkRequestBody: error: ', req.body);
        res.status(503).send('503 Error - Wrong POST parameter');
        return;
      }
      debug('checkRequestBody');
      sanitizeRequestBody();
    }

    function sanitizeRequestBody() {
      const mapName = sanitizer.sanitizeMapName(req.body.mapName);
      debug('checkRequestBody', mapName);
      findMap(mapName);
    }

    function findMap(mapName) {
      const query = { _id: mapName };
      const options = {};

      db.collection('mapCollection').findOne(
        query,
        options,
        (error, mapObject) => {
          if (error) {
            debug('findMap: error:', error);
            res.status(503).send('503 Error - Cannot find map');
            return;
          }

          debug('findMap', mapObject._id);
          prepareGameInstance(mapObject);
        }
      );
    }

    function prepareGameInstance(mapObject) {
      const gameInstance = {};

      gameInstance._id = shortid.generate();

      gameInstance.mapName = mapObject._id;
      gameInstance.mapLayer = toolConvertTiledLayer(mapObject.layers[0]);

      gameInstance.playerArray = [];

      const playerOne = {};
      playerOne.token = shortid.generate();
      playerOne.name = 'Player 1';
      gameInstance.playerArray.push(playerOne);

      const playerTwo = {};
      playerTwo.token = shortid.generate();
      playerTwo.name = 'Player 2';
      gameInstance.playerArray.push(playerTwo);

      // debug('gameInstance.mapLayer: %o', gameInstance.mapLayer);
      debug('prepareGameInstance', gameInstance._id);
      insertGameInstance(gameInstance);
    }

    function insertGameInstance(gameInstance) {
      db.collection('gameCollection').insertOne(gameInstance, (error) => {
        if (error) {
          debug('insertGameInstance: error:', error);
          res.status(503).send('503 Error - Cannot insert game instance');
        }

        debug('insertGameInstance', gameInstance.mapName);
        sendResponce();
      });
    }

    function sendResponce() {
      debug('sendResponce()');
      debug('******************** should redirect ********************');
      res.redirect(environment.baseurl + '/0.1/gamePanel');
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
