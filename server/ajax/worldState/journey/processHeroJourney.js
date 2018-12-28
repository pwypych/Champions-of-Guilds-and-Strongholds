// @format

'use strict';

const debug = require('debug')('cogs:processHeroJourney');
const async = require('async');

// What does this module do?
// Middleware, expects heroId and heroJourney in res.locals, flags heroBegingMoved and processes each step
module.exports = (db, decideHeroStep) => {
  return (req, res, next) => {
    (function init() {
      const ctx = {};
      ctx.entities = res.locals.entities;
      ctx.playerId = res.locals.playerId;
      ctx.heroJourney = res.locals.heroJourney;
      ctx.heroId = res.locals.heroId;
      ctx.hero = ctx.entities[ctx.heroId];

      debug('init: ctx.hero:', ctx.hero);
      checkIsBegingMoved(ctx);
    })();

    function checkIsBegingMoved(ctx) {
      const hero = ctx.hero;

      if (hero.isBegingMoved) {
        debug('checkIsBegingMoved: Yes');
        return;
      }

      checkHeroOwnerComponent(ctx);
    }

    function checkHeroOwnerComponent(ctx) {
      const hero = ctx.hero;
      const playerId = ctx.playerId;

      if (hero.owner !== playerId) {
        debug(
          'checkHeroOwnerComponent: owner and playerId are different, hero.owner:',
          hero.owner,
          'playerId',
          playerId
        );
        return;
      }

      debug('checkHeroOwnerComponent: hero.owner:', hero.owner);
      forEachWishedHeroJourney(ctx);
    }

    function forEachWishedHeroJourney(ctx) {
      const heroJourney = ctx.heroJourney;
      async.eachSeries(
        heroJourney,
        (heroStep, done) => {
          debug('forEachWishedHeroJourney: Start one iteration!');
          ctx.done = done;
          ctx.heroStep = heroStep;
          updateSetIsBegingMoved(ctx);
        },
        (error) => {
          debug('forEachWishedHeroJourney: error:', error);
          debug('forEachWishedHeroJourney: Done!');
          updateUnsetIsBegingMoved(ctx);
          debug('******************** async job done ********************');
        }
      );
    }

    function updateSetIsBegingMoved(ctx) {
      const gameId = ctx.gameId;
      const heroId = ctx.heroId;

      const query = { _id: gameId };
      const string = heroId + '.isBegingMoved';
      const $set = {};
      $set[string] = true;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          debug('updateSetIsBegingMoved: error: ', error);
          next();
          runDecideHeroStep(ctx);
        }
      );
    }

    function runDecideHeroStep(ctx) {
      const gameId = ctx.gameId;
      const heroId = ctx.heroId;
      const heroStep = ctx.heroStep;
      const done = ctx.done;

      decideHeroStep(gameId, heroId, heroStep, (error) => {
        if (error) {
          debug('runDecideHeroStep: error: ', error);
          done(error);
          return;
        }

        debug('runDecideHeroStep: Done!');
        done();
      });
    }

    function updateUnsetIsBegingMoved(ctx) {
      const gameId = ctx.gameId;
      const heroId = ctx.heroId;

      const query = { _id: gameId };
      const string = heroId + '.isBegingMoved';
      const $unset = {};
      $unset[string] = true;
      const update = { $unset: $unset };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          debug('updateUnsetIsBegingMoved: Done! | error: ', error);
        }
      );
    }
  };
};
