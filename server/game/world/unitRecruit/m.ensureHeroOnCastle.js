// @format

'use strict';

const debug = require('debug')('cogs:ensureHeroOnCastle');
const _ = require('lodash');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Check is player on  his castle and let him recruit unit');

      const ctx = {};
      ctx.entities = res.locals.entities;
      ctx.gameId = ctx.entities._id;
      ctx.playerId = res.locals.playerId;

      debug('init:');
      findPlayerCastlePosition(ctx);
    })();

    function findPlayerCastlePosition(ctx) {
      const entities = ctx.entities;
      const playerId = ctx.playerId;
      let castle;

      _.forEach(entities, (entity) => {
        if (entity.visitableType === 'castle' && entity.owner === playerId) {
          castle = entity;
        }
      });

      ctx.castle = castle;
      findHeroId(ctx);
    }

    function findHeroId(ctx) {
      const entities = ctx.entities;
      const playerId = ctx.playerId;

      let heroId;
      let hero;

      _.forEach(entities, (entity, id) => {
        if (entity.heroStats && entity.owner === playerId) {
          heroId = id;
          hero = entity;
        }
      });

      ctx.heroId = heroId;
      ctx.hero = hero;

      checkHeroPosition(ctx);
    }

    function checkHeroPosition(ctx) {
      const hero = ctx.hero;
      const castle = ctx.castle;

      if (
        hero.position.x !== castle.position.x ||
        hero.position.y !== castle.position.y
      ) {
        res.status(503);
        res.send({
          error: 'Hero not on castle!'
        });
        debug('checkHeroPosition: Hero not on castle! Aborting!');
        debug('******************** error ********************');
        return;
      }

      debug('checkHeroPosition: Ok!');
      checkVisitableIsCastle(ctx);
    }

    function checkVisitableIsCastle(ctx) {
      const castle = ctx.castle;

      if (castle.visitableType !== 'castle') {
        res.status(503);
        res.send({
          error: 'Visitable is not a castle!'
        });
        debug('checkVisitableIsCastle: Not a castle! Aborting!');
        debug('******************** error ********************');
        return;
      }

      debug('checkVisitableIsCastle: Ok!');
      checkCastleOwner(ctx);
    }

    function checkCastleOwner(ctx) {
      const castle = ctx.castle;
      const playerId = ctx.playerId;

      if (castle.owner !== playerId) {
        res.status(503);
        res.send({
          error: 'Player is not an owner o this castle!'
        });
        debug(
          'checkCastleOwner: Player is not an owner o this castle! Aborting!'
        );
        debug('******************** error ********************');
        return;
      }

      debug('checkCastleOwner: Ok!');
      next();
    }
  };
};
