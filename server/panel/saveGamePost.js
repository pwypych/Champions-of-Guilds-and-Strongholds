// @format

'use strict';

const debug = require('debug')('cogs:saveGamePost');
const shortid = require('shortid');
const _ = require('lodash');

// What does this module do?
// Copyies game instance from gameCollection to saveCollection
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
      findGameById(gameId);
    }

    function findGameById(gameId) {
      const query = { _id: gameId };
      const options = {};

      db.collection('gameCollection').findOne(
        query,
        options,
        (error, entities) => {
          if (error) {
            debug('findGameById: error:', error);
            res.status(503).send('503 Error - Cannot find game instance');
            return;
          }

          debug('findGameById: _.size(entities):', _.size(entities));
          deleteFromSaveCollection(gameId, entities);
        }
      );
    }

    function deleteFromSaveCollection(gameId, entities) {
      db.collection('saveCollection').deleteOne({ _id: gameId }, (error) => {
        if (error) {
          debug('deleteFromSaveCollection: error:', error);
          res.status(503).send('503 Error - Cannot delete game instance');
          return;
        }

        debug('deleteFromSaveCollection');
        insertToSaveCollection(gameId, entities);
      });
    }

    function insertToSaveCollection(gameId, entities) {
      db.collection('saveCollection').insertOne(entities, (error) => {
        if (error) {
          debug('insertToSaveCollection: error:', error);
          res.status(503).send('503 Error - Cannot insert game instance');
          return;
        }

        debug('insertToSaveCollection: _.size(entities):', _.size(entities));
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
