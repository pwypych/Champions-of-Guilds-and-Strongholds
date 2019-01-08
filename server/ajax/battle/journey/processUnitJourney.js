// @format

'use strict';

const debug = require('debug')('cogs:processUnitJourney');
const async = require('async');

// What does this module do?
// Middleware, expects unitId and unitJourney in res.locals, flags unitBegingMoved and processes each step
module.exports = (db) => {
  return (req, res) => {
    (function init() {
      const ctx = {};
      const entities = res.locals.entities;
      ctx.gameId = entities._id;
      ctx.playerId = res.locals.playerId;
      ctx.unitJourney = res.locals.unitJourney;
      ctx.unitId = res.locals.unitId;
      ctx.unit = entities[ctx.unitId];

      debug('init: ctx.unit:', ctx.unit);
      checkIsProcessingUnitJourney(ctx);
    })();

    function checkIsProcessingUnitJourney(ctx) {
      const unit = ctx.unit;

      if (unit.processingJourneyUntilTimestamp > Date.now()) {
        debug('checkIsProcessingUnitJourney: Yes');
        return;
      }

      forEachWishedUnitJourney(ctx);
    }

    function forEachWishedUnitJourney(ctx) {
      const unitJourney = ctx.unitJourney;
      async.eachSeries(
        unitJourney,
        (wishedUnitStep, done) => {
          debug('forEachWishedUnitJourney: Start one iteration!');
          ctx.done = done;
          ctx.wishedUnitStep = wishedUnitStep;
          setProcessingJourneyUntilTimestamp(ctx);
        },
        (error) => {
          debug('forEachWishedUnitJourney: error:', error);
          debug('forEachWishedUnitJourney: Done!');
          debug('******************** async job done ********************');
          unsetProcessingJourneyUntilTimestamp(ctx);
        }
      );
    }

    function setProcessingJourneyUntilTimestamp(ctx) {
      const gameId = ctx.gameId;
      const unitId = ctx.unitId;

      const query = { _id: gameId };
      const field = unitId + '.processingJourneyUntilTimestamp';
      const $set = {};
      // 250 ms unit move speed + 100ms security margin for processing
      $set[field] = Date.now() + 250 + 100;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          debug('setProcessingJourneyUntilTimestamp: error: ', error);
          runDecideUnitStep(ctx);
        }
      );
    }

    function runDecideUnitStep(ctx) {
      const gameId = ctx.gameId;
      const playerId = ctx.playerId;
      const unitId = ctx.unitId;
      const wishedUnitStep = ctx.wishedUnitStep;
      const done = ctx.done;

      decideUnitStep(gameId, playerId, unitId, wishedUnitStep, (error) => {
        if (error) {
          debug('runDecideUnitStep: error: ', error);
          done(error);
          return;
        }

        debug('runDecideUnitStep: Done!');
        done();
      });
    }

    function unsetProcessingJourneyUntilTimestamp(ctx) {
      const gameId = ctx.gameId;
      const unitId = ctx.unitId;

      const query = { _id: gameId };
      const field = unitId + '.processingJourneyUntilTimestamp';
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
        }
      );
    }
  };
};
