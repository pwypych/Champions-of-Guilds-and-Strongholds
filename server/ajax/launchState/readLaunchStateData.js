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
          generateStateData(gameInstanceObject);
        }
      );
    }

    function generateStateData(gameInstanceObject) {
      const launchStateData = {};
      launchStateData.state = gameInstanceObject.state;

      launchStateData.players = [];
      gameInstanceObject.playerArray.forEach((player) => {
        launchStateData.players.push({ name: player.name });
      });

      debug(
        'generateStateData: launchStateData.players.length',
        launchStateData.players.length
      );
      sendStateData(launchStateData);
    }

    function sendStateData(launchStateData) {
      debug('sendStateData');
      callback(null, launchStateData);
    }
  };
};
