// @format

'use strict';

const debug = require('debug')('nope:cogs:middlewareTokenAuth');
const shortid = require('shortid');
const _ = require('lodash');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Middleware that validates player token and gameId, adds res.locals.playerId'
      );

      const entities = res.locals.entities;

      checkRequestQuery(entities);
    })();

    function checkRequestQuery(entities) {
      if (
        typeof entities === 'undefined' ||
        typeof req.query.playerToken === 'undefined'
      ) {
        res.status(403).send('403 Forbbidden - Missing query variable');
        return;
      }

      const playerToken = req.query.playerToken;

      debug('checkRequestQuery: playerToken:', playerToken);
      validateRequestQuery(entities, playerToken);
    }

    function validateRequestQuery(entities, playerToken) {
      if (!shortid.isValid(playerToken)) {
        debug('validateRequestQuery: invalid playerToken:', playerToken);
        res.status(503).send('503 Service Unavailable - Invalid playerToken');
        return;
      }

      debug('validateRequestQuery');
      findEntityWithPlayerToken(entities, playerToken);
    }

    function findEntityWithPlayerToken(entities, playerToken) {
      let playerId;

      _.forEach(entities, (entity, id) => {
        if (entity.playerToken === playerToken) {
          playerId = id;
        }
      });

      if (!playerId) {
        res
          .status(503)
          .send('503 Service Unavailable - Cannot find playerToken in game');
        return;
      }

      res.locals.playerId = playerId;

      debug('findEntityWithPlayerToken: playerId:', playerId);
      next();
    }
  };
};
