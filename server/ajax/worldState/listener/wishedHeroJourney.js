// @format

'use strict';

const debug = require('debug')('cogs:wishedHeroJourney');
const async = require('async');

// What does this module do?
// Get wishedHeroJourney_ and emmits wishedHeroStep_ events by a defined timer
module.exports = (walkie, db) => {
  return () => {
    (function init() {
      debug('init');
      onWishedHeroJourney();
    })();

    function onWishedHeroJourney() {
      walkie.onEvent(
        'wishedHeroJourney_',
        'wishedHeroJourney.js',
        (data) => {
          const ctx = {};
          ctx.gameId = data.gameId;
          ctx.playerIndex = data.playerIndex;
          ctx.heroJourney = data.heroJourney;
          debug('onWishedHeroJourney: ctx.heroJourney:', ctx.heroJourney);
          findGameById(ctx);
        },
        false
      );
    }

    function findGameById(ctx) {
      const gameId = ctx.gameId;
      const playerIndex = ctx.playerIndex;

      const query = { _id: gameId };
      const options = {};
      options.projection = { playerArray: 1 };

      db.collection('gameCollection').findOne(query, options, (error, game) => {
        debug('findGameById: gameId:', game._id, ' | error: ', error);
        ctx.hero = game.playerArray[playerIndex].hero;
        checkIsBegingMoved(ctx);
      });
    }

    function checkIsBegingMoved(ctx) {
      const hero = ctx.hero;

      if (hero.isBegingMoved) {
        debug('checkIsBegingMoved: Yes');
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
          updateSetIsBegingMoved(ctx);
        },
        (error) => {
          debug('forEachWishedHeroJourney: error:', error);
          debug('forEachWishedHeroJourney: Done!');
          debug('******************** async job done ********************');
        }
      );
    }

    function updateSetIsBegingMoved(ctx) {
      const gameId = ctx.gameId;
      const playerIndex = ctx.playerIndex;

      const query = { _id: gameId };
      const string = 'playerArray.' + playerIndex + '.hero.isBegingMoved';
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
          triggerWishedHeroStep(ctx);
        }
      );
    }

    function triggerWishedHeroStep(ctx) {
      const gameId = ctx.gameId;
      const playerIndex = ctx.playerIndex;
      const wishedHeroStep = ctx.wishedHeroStep;

      debug('triggerWishedHeroStep: ctx.wishedHeroStep:', wishedHeroStep);
      walkie.triggerEvent(
        'wishedHeroStep_',
        'wishedHeroJourney.js',
        {
          gameId: gameId,
          playerIndex: playerIndex,
          wishedHeroStep: wishedHeroStep
        },
        false
      );

      waitBeforeChecking(ctx);
    }

    function waitBeforeChecking(ctx) {
      setTimeout(() => {
        debug('waitBeforeChecking: After waiting 500ms!');
        findCurrentHeroPosition(ctx);
      }, 500);
    }

    function findCurrentHeroPosition(ctx) {
      const gameId = ctx.gameId;
      const playerIndex = ctx.playerIndex;

      const query = { _id: gameId };
      const options = {};
      options.projection = { playerArray: 1 };

      db.collection('gameCollection').findOne(query, options, (error, game) => {
        debug('findCurrentHeroPosition: gameId:', game._id);
        debug('findCurrentHeroPosition: error:', error);
        ctx.heroNew = game.playerArray[playerIndex].hero;

        checkWasHeroMoved(ctx);
      });
    }

    function checkWasHeroMoved(ctx) {
      const heroNew = ctx.heroNew;
      const wishedHeroStep = ctx.wishedHeroStep;

      let wasHeroMoved = false;

      if (heroNew.x === wishedHeroStep.toX) {
        if (heroNew.y === wishedHeroStep.toY) {
          debug('checkWasHeroMoved: Yes!');
          wasHeroMoved = true;
        }
      }

      debug('checkWasHeroMoved: wasHeroMoved:', wasHeroMoved);
      updateUnsetIsBegingMoved(ctx, wasHeroMoved);
    }

    function updateUnsetIsBegingMoved(ctx, wasHeroMoved) {
      const gameId = ctx.gameId;
      const playerIndex = ctx.playerIndex;

      const query = { _id: gameId };
      const string = 'playerArray.' + playerIndex + '.hero.isBegingMoved';
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
          if (wasHeroMoved) {
            ctx.done();
          } else {
            ctx.done('Hero was not moved correctly last step');
          }
        }
      );
    }
  };
};
