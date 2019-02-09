// @format

'use strict';

const debug = require('debug')('cogs:deleteGamePost');
const shortid = require('shortid');

// What does this module do?
// Delete game instance on player button click
module.exports = (environment, db) => {
  return (req, res) => {
    (function init() {
      debug('init');
      checkRequestBody();
    })();

    function checkRequestBody() {
      if (!req.body.gameId) {
        debug('validateShortId: error: ', req.body);
        res.status(503).send('503 Error - Wrong POST parameter');
        return;
      }
      debug('checkRequestBody');
      validateRequestBody();
    }

    function validateRequestBody() {
      const gameId = req.body.gameId;

      if (!shortid.isValid(gameId)) {
        debug('validateShortId: error: ', gameId);
        res.status(503).send('503 Error - gameId is not valid');
        return;
      }
      debug('validateRequestBody', gameId);
      deleteGame(gameId);
    }

    function deleteGame(gameId) {
      db.collection('gameCollection').deleteOne({ _id: gameId }, (error) => {
        if (error) {
          debug('deleteGamePost: error:', error);
          res.status(503).send('503 Error - Cannot delete game instance');
          return;
        }

        debug('deleteGamePost');
        sendResponce();
      });
    }

    function sendResponce() {
      debug('sendResponce()');
      debug('******************** should redirect ********************');
      res.redirect(environment.baseurl + '/panel');
    }
  };
};
