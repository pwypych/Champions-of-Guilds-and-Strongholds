// @format

'use strict';

const debug = require('debug')('cogs:loadGamePost');
const shortid = require('shortid');
const _ = require('lodash');

module.exports = (environment, db) => {
  return (req, res) => {
    (function init() {
      debug('// Copyies game instance from saveCollection to gameCollection');

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

      if (!req.body.direction) {
        debug('validateRequestBody: Missing req.body.direction!');
        res.status(503).send('503 Error - no load direction!');
        return;
      }

      debug('validateRequestBody: req.body.direction:', req.body.direction);
      findTurnCountByGameId(gameId);
    }

    function findTurnCountByGameId(gameId) {
      const query = { _id: gameId };
      const options = { projection: { turnCount: 1 } };

      db.collection('saveCollection').findOne(
        query,
        options,
        (error, result) => {
          if (error) {
            debug('findTurnCountByGameId: error:', error);
            res.status(503).send('503 Error - Cannot find game instance');
            return;
          }

          if (result === null) {
            debug('findTurnCountByGameId: No saved games!:');
            res.send({ error: 0 });
            return;
          }

          debug('findTurnCountByGameId: result:', result);
          decideWhichTurnLoad(gameId, result.turnCount);
        }
      );
    }

    function decideWhichTurnLoad(gameId, turnCount) {
      let turnNumber = null;
      if (req.body.direction === 'previous') {
        turnNumber = turnCount - 1;
      }

      if (req.body.direction === 'next') {
        turnNumber = turnCount + 1;
      }

      if (turnNumber === null) {
        debug('decideWhichTurnLoad: Wrong direction:', req.body.direction);
        res.status(503).send('503 Error - Wrong direction parameter!');
        return;
      }

      debug('decideWhichTurnLoad', turnNumber);
      findSavedGame(gameId, turnNumber);
    }

    function findSavedGame(gameId, turnNumber) {
      const query = { _id: gameId };

      const projection = {};
      const field = 'save.' + turnNumber;
      projection[field] = 1;

      const options = { projection: projection };

      db.collection('saveCollection').findOne(
        query,
        options,
        (error, entities) => {
          if (error) {
            debug('findSavedGame: error: ', error);
          }

          if (typeof entities.save[turnNumber] === 'undefined') {
            debug('findSavedGame: No game for given turn number!');
            res.send({ error: 0 });
            return;
          }

          debug('findSavedGame: _id:', entities.save[turnNumber]._id);
          updateSetTurnCountAfterLoad(
            gameId,
            entities.save[turnNumber],
            turnNumber
          );
        }
      );
    }

    function updateSetTurnCountAfterLoad(gameId, entities, turnNumber) {
      const query = { _id: gameId };
      const $set = {};
      $set.turnCount = turnNumber;
      const update = { $set: $set };
      const options = {};

      db.collection('saveCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateSetTurnCountAfterLoad: error: ', error);
          }

          debug('updateSetTurnCountAfterLoad: turnCount updated:', turnNumber);
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

        debug('deleteGame');
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
