// @format

'use strict';

const debug = require('debug')('cogs:deleteGamePost');

module.exports = (environment, sanitizer, db) => {
  return (req, res) => {
    const viewModel = {};
    viewModel.baseurl = environment.baseurl;

    (function init() {
      debug('init');
      validateShortId();
    })();

    function validateShortId() {
      if (!req.body.gameId) {
        debug('validateShortId: error: ', req.body);
        res.status(503).send('503 Error - Wrong POST parameter');
        return;
      }

      const gameId = req.body.gameId;

      if (!sanitizer.isValidShortId(gameId)) {
        debug('validateShortId: error: ', gameId);
        res.status(503).send('503 Error - gameId is not valid');
        return;
      }
      debug('validateShortId', gameId);
      deleteGame(gameId);
    }

    function deleteGame(gameId) {
      debug('deleteGame:gameId', gameId);
      db.collection('gameCollection').deleteOne({ _id: gameId }, (error) => {
        if (error) {
          debug('deleteGamePost: error:', error);
          res.status(503).send('503 Error - Cannot insert game instance');
        }
      });

      debug('deleteGamePost');
      sendResponce();
    }

    function sendResponce() {
      debug('sendResponce()');
      debug('******************** should redirect ********************');
      res.redirect(environment.baseurl + '/0.1/createGame');
    }
  };
};
