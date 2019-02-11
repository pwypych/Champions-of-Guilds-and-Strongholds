// @format

'use strict';

const debug = require('debug')('cogs:loadGamePost');
const shortid = require('shortid');
const _ = require('lodash');

// What does this module do?
// Copyies game instance from saveCollection to gameCollection
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
      findSaveById(gameId);
    }

    function findSaveById(gameId) {
      const query = { _id: gameId };
      const options = {};

      db.collection('saveCollection').findOne(
        query,
        options,
        (error, entities) => {
          if (error) {
            debug('findSaveById: error:', error);
            res.status(503).send('503 Error - Cannot find game instance');
            return;
          }

          debug('findSaveById: _.size(entities):', _.size(entities));
          deleteGame(gameId, entities);
        }
      );
    }

    function deleteGame(gameId, entities) {
      db.collection('gameCollection').deleteOne({ _id: gameId }, (error) => {
        if (error) {
          debug('deleteGame: error:', error);
          res.status(503).send('503 Error - Cannot delete game instance');
          return;
        }

        debug('deleteFromSaveCollection');
        insertGame(gameId, entities);
      });
    }

    function insertGame(gameId, entities) {
      db.collection('gameCollection').insertOne(entities, (error) => {
        if (error) {
          debug('insertGame: error:', error);
          res.status(503).send('503 Error - Cannot insert game instance');
          return;
        }

        debug('insertGame: _.size(entities):', _.size(entities));
        sendResponce();
      });
    }

    function sendResponce() {
      debug('sendResponce()');
      if (req.body.redirect) {
        debug('******************** redirect ********************');
        res.redirect(environment.baseurl + '/panel');
      } else {
        debug('******************** ajax ********************');
        res.send({ error: 0 });
      }
    }
  };
};
