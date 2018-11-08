// @format

'use strict';

const debug = require('debug')('cogs:readGameStateData');

module.exports = (db) => {
  return (req, res) => {
    let gameInstanceId;

    (function init() {
      debug('init');
      getRequestQuery();
    })();

    function getRequestQuery() {
      debug('req.query', req.query);

      gameInstanceId = req.query.gameInstanceId;

      debug('getRequestQuery:', gameInstanceId);
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
          createGameSetupObject(gameInstanceObject);
        }
      );
    }

    function createGameSetupObject(gameInstanceObject) {
      const gameSetupObject = {};
      gameSetupObject.gameState = gameInstanceObject.gameState;

      gameSetupObject.players = [];
      gameInstanceObject.playerArray.forEach((player) => {
        gameSetupObject.players.push(player);
      });

      debug(
        'createGameSetupObject: gameSetupObject.players.length',
        gameSetupObject.players.length
      );
      sendSetupGameObject(gameSetupObject);
    }

    function sendSetupGameObject(gameSetupObject) {
      debug('sendMapLayer');
      res.send(gameSetupObject);
      debug('******************** ajax ********************');
    }
  };
};
