// @format

'use strict';

const debug = require('debug')('cogs:deleteGamePost');

module.exports = (environment, sanitizer, db) => {
  return (req, res) => {
    (function init() {
      debug('init');
      checkRequestBody();
    })();

    function checkRequestBody() {
      if (!req.body.gameInstanceId) {
        debug('validateShortId: error: ', req.body);
        res.status(503).send('503 Error - Wrong POST parameter');
        return;
      }
      debug('checkRequestBody');
      validateRequestBody();
    }

    function validateRequestBody() {
      const gameInstanceId = req.body.gameInstanceId;

      if (!sanitizer.isValidShortId(gameInstanceId)) {
        debug('validateShortId: error: ', gameInstanceId);
        res.status(503).send('503 Error - gameInstanceId is not valid');
        return;
      }
      debug('validateRequestBody', gameInstanceId);
      deleteGame(gameInstanceId);
    }

    function deleteGame(gameInstanceId) {
      db.collection('gameCollection').deleteOne(
        { _id: gameInstanceId },
        (error) => {
          if (error) {
            debug('deleteGamePost: error:', error);
            res.status(503).send('503 Error - Cannot delete game instance');
          }
        }
      );

      debug('deleteGamePost');
      sendResponce();
    }

    function sendResponce() {
      debug('sendResponce()');
      debug('******************** should redirect ********************');
      res.redirect(environment.baseurl + '/0.1/gamePanel');
    }
  };
};
