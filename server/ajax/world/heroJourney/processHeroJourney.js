// @format

'use strict';

const debug = require('debug')('cogs:processHeroJourney');
const async = require('async');

module.exports = (db, decideHeroStep) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Middleware, expects heroId and heroJourney in res.locals, flags heroBegingMoved and processes each step'
      );

      const ctx = {};
      const entities = res.locals.entities;
      ctx.gameId = entities._id;
      ctx.playerId = res.locals.playerId;
      ctx.heroJourney = res.locals.heroJourney;
      ctx.heroId = res.locals.heroId;
      ctx.hero = entities[ctx.heroId];

      checkIsProcessingJourney(ctx);
    })();

    function checkIsProcessingJourney(ctx) {
      const hero = ctx.hero;

      if (hero.processingJourneyUntilTimestamp > Date.now()) {
        debug('checkIsProcessingJourney: Yes');
        return;
      }

      forEachWishedHeroJourney(ctx);
    }

    function forEachWishedHeroJourney(ctx) {
      const heroJourney = ctx.heroJourney;
      async.eachSeries(
        heroJourney,
        (wishedHeroStep, done) => {
          debug('forEachWishedHeroJourney: Start one iteration!');
          ctx.done = done;
          ctx.wishedHeroStep = wishedHeroStep;
          setProcessingJourneyUntilTimestamp(ctx);
        },
        (error) => {
          debug('forEachWishedHeroJourney: error:', error);
          debug('forEachWishedHeroJourney: Done!');
          debug('******************** async job done ********************');
          unsetProcessingJourneyUntilTimestamp(ctx);
        }
      );
    }

    function setProcessingJourneyUntilTimestamp(ctx) {
      const gameId = ctx.gameId;
      const heroId = ctx.heroId;

      const query = { _id: gameId };
      const field = heroId + '.processingJourneyUntilTimestamp';
      const $set = {};
      // 150 ms hero move speed + 100ms security margin for processing
      $set[field] = Date.now() + 150 + 100;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          debug('setProcessingJourneyUntilTimestamp: error: ', error);
          runDecideHeroStep(ctx);
        }
      );
    }

    function runDecideHeroStep(ctx) {
      const gameId = ctx.gameId;
      const playerId = ctx.playerId;
      const heroId = ctx.heroId;
      const wishedHeroStep = ctx.wishedHeroStep;
      const done = ctx.done;

      decideHeroStep(gameId, playerId, heroId, wishedHeroStep, (error) => {
        if (error) {
          debug('runDecideHeroStep: error: ', error);
          done(error);
          return;
        }

        debug('runDecideHeroStep: Done!');
        done();
      });
    }

    function unsetProcessingJourneyUntilTimestamp(ctx) {
      const gameId = ctx.gameId;
      const heroId = ctx.heroId;

      const query = { _id: gameId };
      const field = heroId + '.processingJourneyUntilTimestamp';
      const $unset = {};
      $unset[field] = true;
      const update = { $unset: $unset };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          debug('unsetProcessingJourneyUntilTimestamp: Done! | error: ', error);
          next();
        }
      );
    }
  };
};
