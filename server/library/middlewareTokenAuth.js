// @format

'use strict';

// What does this module do?
// Validates player token and gameId, checks if player belong to this game
const debug = require('debug')('nope:cogs:middlewareTokenAuth');
const shortid = require('shortid');
const _ = require('lodash');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('init');
      checkRequestQuery();
    })();

    function checkRequestQuery() {
      if (
        typeof req.query.gameId === 'undefined' ||
        typeof req.query.playerToken === 'undefined'
      ) {
        res.status(403).send('403 Forbbidden - Missing query variable');
        return;
      }

      const gameId = req.query.gameId;
      const playerToken = req.query.playerToken;

      debug('checkRequestQuery:', playerToken, gameId);
      validateRequestQuery(gameId, playerToken);
    }

    function validateRequestQuery(gameId, playerToken) {
      if (!shortid.isValid(gameId)) {
        debug('validateRequestQuery: Invalid gameId:', gameId);
        res.status(503).send('503 Service Unavailable - Invalid gameId');
        return;
      }

      if (!shortid.isValid(playerToken)) {
        debug('validateRequestQuery: invalid playerToken:', playerToken);
        res.status(503).send('503 Service Unavailable - Invalid playerToken');
        return;
      }

      debug('validateRequestQuery');
      findGameById(gameId, playerToken);
    }

    function findGameById(gameId, playerToken) {
      const query = { _id: gameId };
      const options = {};

      db.collection('gameCollection').findOne(query, options, (error, game) => {
        if (error) {
          debug('findGameById: error:', error);
          res
            .status(503)
            .send('503 Service Unavailable - Error', error.message);
          return;
        }

        if (!game) {
          res.status(503).send('503 Service Unavailable - Cannot find gameId');
          return;
        }

        const entities = game;
        debug('findGameById', entities._id);
        findEntityWithPlayerToken(entities, playerToken);
      });
    }

    function findEntityWithPlayerToken(entities, playerToken) {
      let playerId = '';

      _.forEach(entities, (entity, id) => {
        if (entity.playerToken === playerToken) {
          playerId = id;
        }
      });

      if (playerId === '') {
        res
          .status(503)
          .send('503 Service Unavailable - Cannot find playerToken in game');
        return;
      }

      res.locals.playerId = playerId;
      res.locals.entities = entities;

      debug('findEntityWithPlayerToken: playerId:', playerId);
      next();
    }
  };
};
