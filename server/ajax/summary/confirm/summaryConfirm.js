// @format

'use strict';

const debug = require('debug')('cogs:summaryConfirm');
const _ = require('lodash');

// What does this module do?
//
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      const ctx = {};
      const entities = res.locals.entities;
      ctx.gameId = entities._id;
      ctx.playerId = res.locals.playerId;

      debug('init: ctx.unitId:', ctx.unitId);
      checkIsPlayerWinnerConfirming(ctx);
    })();

    function checkIsPlayerWinnerConfirming(ctx) {
      const playerId = ctx.playerId;
      const entities = res.locals.entities;

      let isPlayerWinnerConfirming = false;
      _.forEach(entities, (entity) => {
        if (entity.unitStats && entity.owner === playerId) {
          isPlayerWinnerConfirming = true;
          ctx.winnerFigureId = entity.boss;
        }
      });

      if (!isPlayerWinnerConfirming) {
        debug(
          'checkIsPlayerWinnerConfirming: isPlayerWinnerConfirming:',
          isPlayerWinnerConfirming
        );
        res.status(403).send('403 Forbbidden - Only winner can confirm');
        return;
      }

      debug(
        'checkIsPlayerWinnerConfirming: isPlayerWinnerConfirming:',
        isPlayerWinnerConfirming
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
      let loserFigureId;

      _.forEach(entities, (entity) => {
        if (entity.battleStatus === 'active') {
          if (entity.attackerId === winnerFigureId) {
            loserFigureId = entity.defenderId;
          } else {
            loserFigureId = entity.attackerId;
          }
        }
      });

      debug('findBattleLoser: loserFigureId:', loserFigureId);
      ctx.loserFigureId = loserFigureId;
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
      updateUnsetBattleUnits(ctx);
    }

    function updateUnsetBattleUnits(ctx) {
      const entities = res.locals.entities;
      const gameId = ctx.gameId;

      const query = { _id: gameId };
      const $unset = {};

      _.forEach(entities, (entity, id) => {
        if (entity.unitName) {
          $unset[id] = true;
        }
      });

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

          debug('updateUnsetBattleUnits: Battle units removed!');
          updateUnsetBattleEntity(ctx);
        }
      );
    }

    function updateUnsetBattleEntity(ctx) {
      const entities = res.locals.entities;
      const gameId = ctx.gameId;

      const query = { _id: gameId };
      const $unset = {};

      _.forEach(entities, (entity, id) => {
        if (entity.battleStatus === 'active') {
          $unset[id] = true;
        }
      });

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

          debug('updateUnsetBattleEntity: Battle entity removed!');
          updateUnsetLoserFigure(ctx);
        }
      );
    }

    function updateUnsetLoserFigure(ctx) {
      const gameId = ctx.gameId;
      const field = ctx.loserFigureId;

      const query = { _id: gameId };

      const $unset = {};
      $unset[field] = true;

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

          debug('updateUnsetLoserFigure: Loser figure removed!');
          checkIsHeroWinner(ctx);
        }
      );
    }

    function checkIsHeroWinner(ctx) {
      const entities = res.locals.entities;
      const winnerFigureId = ctx.winnerFigureId;
      const winnerEntity = entities[winnerFigureId];

      if (!winnerEntity.heroStats) {
        debug('checkIsHeroWinner: No, winner is probably non hero figure!');
        next();
        return;
      }

      debug('checkIsHeroWinner: Yes, winner is hero figure!');
      updateWinnerHeroUnitCounts(ctx);
    }

    function updateWinnerHeroUnitCounts(ctx) {
      const gameId = ctx.gameId;
      const unitsLeft = ctx.unitsLeft;
      const winnerFigureId = ctx.winnerFigureId;

      const query = { _id: gameId };
      const $set = {};
      const field = winnerFigureId + '.unitCounts';

      $set[field] = unitsLeft;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('ERROR: update mongo error:', error);
          }

          debug(
            'updateWinnerHeroUnitCounts: Update winner hero unitCounts!',
            ctx.unitsLeft
          );
          next();
        }
      );
    }
  };
};
