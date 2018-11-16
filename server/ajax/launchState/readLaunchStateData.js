// @format

'use strict';

const debug = require('debug')('cogs:readLaunchStateData');

module.exports = (db) => {
  return (req, res) => {
    const gameInstanceId = res.locals.gameInstanceId;

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
            res
              .status(503)
              .send('503 Service Unavailable - Cannot find gameInstance');
            return;
          }

          debug('findGameInstance', gameInstanceObject._id);
          generateGameStateData(gameInstanceObject);
        }
      );
    }

    function generateGameStateData(gameInstanceObject) {
      const gameStateData = {};
      gameStateData.gameState = gameInstanceObject.gameState;

      gameStateData.players = [];
      gameInstanceObject.playerArray.forEach((player) => {
        gameStateData.players.push({ name: player.name });
      });

      debug(
        'generateGameStateData: gameStateData.players.length',
        gameStateData.players.length
      );
      sendGameStateData(gameStateData);
    }

    function sendGameStateData(gameStateData) {
      debug('sendGameStateData');
      res.send(gameStateData);
      debug('******************** ajax ********************');
    }
  };
};
