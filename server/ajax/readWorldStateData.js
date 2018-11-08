// @format

'use strict';

const debug = require('debug')('cogs:readWorldStateData');

module.exports = (db) => {
  return (req, res) => {
    let gameInstanceId;

    (function init() {
      debug('init');
      getResponseLocals();
    })();

    function getResponseLocals() {
      debug('res.locals', res.locals);

      gameInstanceId = res.locals.gameInstanceId;

      debug('getResponseLocals:', gameInstanceId);
      findGameInstance();
    }

    function findGameInstance() {
      const query = { _id: gameInstanceId };
      const options = {};

      db.collection('gameInstanceCollection').findOne(
        query,
        options,
        (error, gameInstanceObject) => {
          if (error || !gameInstanceObject) {
            debug('findMapLayer: error:', error);
            res
              .status(503)
              .send('503 Service Unavailable - Cannot find gameInstance');
            return;
          }

          debug('findGameInstance', gameInstanceObject._id);
          generateWorldStateData(gameInstanceObject);
        }
      );
    }

    function generateWorldStateData(gameInstanceObject) {
      const worldStateData = {};
      worldStateData.gameState = gameInstanceObject.gameState;

      worldStateData.mapLayer = gameInstanceObject.mapLayer;

      debug(
        'generateWorldStateData: worldStateData.players.length',
        worldStateData.mapLayer.length
      );
      sendGameStateData(worldStateData);
    }

    function sendGameStateData(worldStateData) {
      debug('sendGameStateData');
      res.send(worldStateData);
      debug('******************** ajax ********************');
    }
  };
};
