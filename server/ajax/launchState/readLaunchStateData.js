// @format

'use strict';

const debug = require('debug')('cogs:readLaunchStateData');

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
          generateGameStateData(gameInstanceObject);
        }
      );
    }

    function generateGameStateData(gameInstanceObject) {
      const launchStateData = {};
      launchStateData.gameState = gameInstanceObject.gameState;

      launchStateData.players = [];
      gameInstanceObject.playerArray.forEach((player) => {
        launchStateData.players.push({ name: player.name });
      });

      debug(
        'generateGameStateData: launchStateData.players.length',
        launchStateData.players.length
      );
      sendGameStateData(launchStateData);
    }

    function sendGameStateData(launchStateData) {
      debug('sendGameStateData');
      callback(null, launchStateData);
    }
  };
};
