// @format

'use strict';

const debug = require('debug')('cogs:mineStoneVisit');
const _ = require('lodash');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Check is visit is possible, change visitable owner and add enchantment'
      );

      const ctx = {};
      const entities = res.locals.entities;
      ctx.gameId = entities._id;
      ctx.playerId = res.locals.playerId;
      ctx.entityId = res.locals.entityId;
      ctx.visitable = entities[ctx.entityId];

      debug('init: ctx:', ctx);
      findHeroId(ctx);
    })();

    function findHeroId(ctx) {
      const entities = res.locals.entities;
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

      debug('findHeroId: heroId:', heroId);
      checkHeroPosition(ctx);
    }

    function checkHeroPosition(ctx) {
      const hero = ctx.hero;
      const visitable = ctx.visitable;

      if (
        hero.position.x !== visitable.position.x ||
        hero.position.y !== visitable.position.y
      ) {
        debug('checkHeroPosition: Hero not on visitable! Aborting!');
        next();
        return;
      }

      debug('checkHeroPosition: Ok!');
      next();
    }

    // check if effect exists

    // check if effect owner has changed

    // change owner of the effect

  };
};
