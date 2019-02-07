// @format

'use strict';

const debug = require('debug')('cogs:finishedBattleConfirm');
const _ = require('lodash');

// What does this module do?
// Exept
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      const ctx = {};
      const entities = res.locals.entities;
      ctx.gameId = entities._id;
      ctx.playerId = res.locals.playerId;

      debug('init: ctx.unitId:', ctx.unitId);
      checkIsWinner(ctx);
    })();

    function checkIsWinner(ctx) {
      const playerId = ctx.playerId;
      const entities = res.locals.entities;

      let isWinnerPlayerConfirming = false;
      _.forEach(entities, (entity, id) => {
        if (entity.unitStats && entity.owner === playerId) {
          debug('checkIsWinner: id:', id);
          debug('checkIsWinner: playerId:', playerId);
          isWinnerPlayerConfirming = true;
          ctx.winnerFigureId = entity.boss;
        }
      });

      if (!isWinnerPlayerConfirming) {
        debug(
          'checkIsWinner: isWinnerPlayerConfirming:',
          isWinnerPlayerConfirming
        );
        res.status(403).send('403 Forbbidden - Only winner can confirm');
        return;
      }

      debug(
        'checkIsWinner: isWinnerPlayerConfirming:',
        isWinnerPlayerConfirming
      );
      calculateExperience(ctx);
    }

    function calculateExperience(ctx) {
      debug('calculateExperience:');
      findBattleLoser(ctx);
    }

    function findBattleLoser(ctx) {
      const entities = res.locals.entities;
      const winnerFigureId = ctx.winnerFigureId;

      _.forEach(entities, (entity) => {
        if (entity.battleStatus === 'finished') {
          if (entity.attackerId === winnerFigureId) {
            ctx.loserFigureId = entity.defenderId;
          } else {
            ctx.loserFigureId = entity.attackerId;
          }
        }
      });

      debug('checkIsWinner: ctx.loserFigureId:', ctx.loserFigureId);
      debug('checkIsWinner: ctx.winnerFigureId:', ctx.winnerFigureId);
      generateWinnerUnitsLeft(ctx);
    }

    function generateWinnerUnitsLeft(ctx) {
      const entities = res.locals.entities;
      const unitsLeft = {};

      _.forEach(entities, (entity) => {
        if (entity.unitStats) {
          unitsLeft[entity.unitName] = entity.amount;
        }
      });

      ctx.unitsLeft = unitsLeft;
      debug('generateWinnerUnitsLeft: unitsLeft:', unitsLeft);
      updateUnsetBattleEntities(ctx);
    }

    function updateUnsetBattleEntities(ctx) {
      const entities = res.locals.entities;
      const gameId = ctx.gameId;
      const loserFigureId = ctx.loserFigureId;
      const query = { _id: gameId };
      const $unset = {};

      _.forEach(entities, (entity, id) => {
        if (entity.unitName) {
          $unset[id] = true;
        }
      });
      $unset[loserFigureId] = true;

      const update = { $unset: $unset };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('ERROR: update mongo error:', error);
          }

          debug('updateUnsetBattleEntities: Target was killed');
          isPlayerWinner(ctx);
        }
      );
    }

    function isPlayerWinner(ctx) {
      const entities = res.locals.entities;
      const winnerFigureId = ctx.winnerFigureId;
      const winnerEntity = entities[winnerFigureId];

      if (!winnerEntity.heroStats) {
        debug('isPlayerWinner: NO');
        next();
        return;
      }

      updateWinnerFigure(ctx);
    }

    function updateWinnerFigure(ctx) {}
  };
};
