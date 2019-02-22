// @format

'use strict';

const debug = require('debug')('cogs:maneuverJourney');
const validator = require('validator');
const async = require('async');

module.exports = (
  db,
  decideUnitStep,
  refillUnitMovement,
  updateRecentActivity
) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Middleware, expects unitId and unitJourney in res.locals, flags unitBegingMoved and processes each step'
      );

      const ctx = {};
      const entities = res.locals.entities;
      ctx.gameId = entities._id;
      ctx.playerId = res.locals.playerId;
      ctx.unitId = res.locals.unitId;
      ctx.unit = entities[ctx.unitId];

      checkRequestBodyUnitJourney(ctx);
    })();

    function checkRequestBodyUnitJourney(ctx) {
      const unitJourney = [];
      let isError = false;

      req.body.unitJourney.forEach((step) => {
        if (
          typeof step.fromX === 'undefined' ||
          typeof step.fromY === 'undefined' ||
          typeof step.toX === 'undefined' ||
          typeof step.toY === 'undefined' ||
          !validator.isNumeric(step.fromX) ||
          !validator.isNumeric(step.fromY) ||
          !validator.isNumeric(step.toX) ||
          !validator.isNumeric(step.toY)
        ) {
          debug('POST parameter unitJourney not valid!');
          isError = true;
          return;
        }

        const parsedStep = {};
        parsedStep.fromX = parseInt(step.fromX, 10);
        parsedStep.fromY = parseInt(step.fromY, 10);
        parsedStep.toX = parseInt(step.toX, 10);
        parsedStep.toY = parseInt(step.toY, 10);
        unitJourney.push(parsedStep);
      });

      if (isError) {
        return;
      }
      ctx.unitJourney = unitJourney;

      debug('checkRequestBodyUnitJourney: unitJourney', unitJourney);
      checkIsProcessingUnitJourney(ctx);
    }

    function checkIsProcessingUnitJourney(ctx) {
      const unit = ctx.unit;

      if (unit.processingJourneyUntilTimestamp > Date.now()) {
        debug('checkIsProcessingUnitJourney: Yes!');
        return;
      }

      runUpdateUnitRecentManeuver(ctx);
    }

    function runUpdateUnitRecentManeuver(ctx) {
      const gameId = ctx.gameId;
      const unitId = ctx.unitId;
      const unitJourney = ctx.unitJourney;

      const recentManeuver = {};
      recentManeuver.name = 'onJourney';
      recentManeuver.unitJourney = unitJourney;
      recentManeuver.timestamp = Date.now();

      debug('runUpdateUnitRecentManeuver: Starting...');
      updateRecentActivity(gameId, unitId, recentManeuver, () => {
        debug('runUpdateUnitRecentManeuver: Success!');
        forEachUnitJourney(ctx);
      });
    }

    function forEachUnitJourney(ctx) {
      const unitJourney = ctx.unitJourney;
      async.eachSeries(
        unitJourney,
        (wishedUnitStep, done) => {
          debug('forEachUnitJourney: Start one iteration!');
          ctx.done = done;
          ctx.wishedUnitStep = wishedUnitStep;
          setProcessingJourneyUntilTimestamp(ctx);
        },
        (error) => {
          debug('forEachUnitJourney: error:', error);
          debug('forEachUnitJourney: Done!');
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
      const unitMoveSpeed = 150; // ms
      const securityMargin = 100; // ms
      $set[field] = Date.now() + unitMoveSpeed + securityMargin;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          debug('setProcessingJourneyUntilTimestamp: error: ', error);
          debug('setProcessingJourneyUntilTimestamp: Timestamp set!');
          runDecideUnitStep(ctx);
        }
      );
    }

    function runDecideUnitStep(ctx) {
      debug('runDecideUnitStep: Starting...');
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
          debug('unsetProcessingJourneyUntilTimestamp: Timestamp unset!');
          runRefillUnitMovement(gameId, unitId);
        }
      );
    }

    function runRefillUnitMovement(gameId, unitId) {
      debug('runRefillUnitMovement: Starting...');
      refillUnitMovement(gameId, unitId, () => {
        debug('runRefillUnitMovement: Success!');
        next();
      });
    }
  };
};
