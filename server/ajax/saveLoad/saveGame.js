// @format

'use strict';

const debug = require('debug')('cogs:saveGame.js');
const _ = require('lodash');

module.exports = (findEntitiesByGameId, db) => {
  return (req, res, next) => {
    (function init() {
      debug('// Add game to save collection, increment turnCount');

      const gameId = res.locals.entities._id;

      runFindEntitiesByGameId(gameId);
    })();

    function runFindEntitiesByGameId(gameId) {
      findEntitiesByGameId(gameId, (error, entities) => {
        debug('runFindEntitiesByGameId');
        findSavedGame(gameId, entities);
      });
    }

    function findSavedGame(gameId, entities) {
      const query = { _id: gameId };
      const options = {};

      db.collection('saveCollection').findOne(
        query,
        options,
        (error, savedEntities) => {
          if (error) {
            debug('findSavedGame: error: ', error);
          }

          if (savedEntities === null) {
            debug('findSavedGame - no saved games for this game');
            generateSaveGameObject(gameId, entities);
            return;
          }

          debug('findSavedGame: turnCount:', savedEntities.turnCount);
          updateIncrementTurnCount(gameId, entities);
        }
      );
    }

    function generateSaveGameObject(gameId, entities) {
      const save = {
        _id: gameId,
        turnCount: 0,
        save: { 0: entities }
      };

      insertGeneratedSaveGame(save);
    }

    function insertGeneratedSaveGame(save) {
      db.collection('saveCollection').insertOne(save, (error) => {
        if (error) {
          debug('insertGeneratedSaveGame: error:', error);
          return;
        }

        debug('insertGeneratedSaveGame: _.size(save):', _.size(save));
        next();
      });
    }

    function updateIncrementTurnCount(gameId, entities) {
      const query = { _id: gameId };

      const $inc = {};
      $inc.turnCount = 1;
      const update = { $inc: $inc };

      const options = { returnOriginal: false };

      db.collection('saveCollection').findOneAndUpdate(
        query,
        update,
        options,
        (error, result) => {
          if (error) {
            debug('updateIncrementTurnCount: error: ', error);
          }

          debug('updateIncrementTurnCount: turnCount:', result.value.turnCount);
          updateSetNewSave(gameId, entities, result.value.turnCount);
        }
      );
    }

    function updateSetNewSave(gameId, entities, turnCount) {
      const query = { _id: gameId };
      const $set = {};
      const field = 'save.' + turnCount;
      $set[field] = entities;
      const update = { $set: $set };
      const options = {};

      db.collection('saveCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateSetNewSave: error:', error);
          }

          debug('updateSetNewSave: Saved!:', field);
          next();
        }
      );
    }
  };
};
