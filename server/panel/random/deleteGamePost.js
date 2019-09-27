// @format

'use strict';

const debug = require('debug')('cogs:deleteGamePost');
const shortid = require('shortid');

module.exports = (environment, db) => {
  return (req, res) => {
    (function init() {
      debug('// Delete game instance on player button click');

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
        deleteSaveGame(gameId);
      });
    }

    function deleteSaveGame(gameId) {
      db.collection('saveCollection').deleteOne({ _id: gameId }, (error) => {
        if (error) {
          debug('deleteSaveGamePost: error:', error);
          res.status(503).send('503 Error - Cannot delete save game instance');
          return;
        }

        debug('deleteSaveGamePost');
        sendResponse();
      });
    }

    function sendResponse() {
      debug('sendResponse()');
      debug('******************** should redirect ********************');
      res.redirect(environment.baseurl + '/panel');
    }
  };
};
