// @format

'use strict';

const debug = require('debug')('cogs:readWorldStateData');

module.exports = (db) => {
  return (gameInstanceId, callback) => {
    (function init() {
      debug('init');
      findGameInstance();
    })();

    function findGameInstance() {
      const query = { _id: gameInstanceId };
      const options = {};

      db.collection('gameInstanceCollection').findOne(
        query,
        options,
        (error, gameInstanceObject) => {
          if (error || !gameInstanceObject) {
            debug('findMapLayer: error:', error);
            callback('Cannot find gameInstance' + JSON.stringify(error));
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
      callback(null, worldStateData);
    }
  };
};
