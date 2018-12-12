// @format

'use strict';

const debug = require('debug')('cogs:wishedHeroJourney');
// const async = require('async');

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
          debug('******************** listener start ********************');
          const ctx = {};
          ctx.gameId = data.gameId;
          ctx.playerIndex = data.playerIndex;
          ctx.heroJourney = data.heroJourney;
          debug('onWishedHeroJourney: ctx:', ctx);
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

      setIsBegingMoved(ctx);
    }

    // function forEachWishedHeroJourney(gameId, heroJourney, playerIndex) {
    //   async.eachSeries(
    //     heroJourney,
    //     (wishedStep, done) => {
    //       findCurrentHeroPosition(wishedStep, done);
    //     },
    //     (error) => {
    //       debug('done');
    //       res.send({ error: 0 });
    //     }
    //   );
    // }

    function setIsBegingMoved(ctx) {
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
          debug('setIsBegingMoved: error: ', error);
          triggerWishedHeroStep(ctx);
        }
      );
    }

    function triggerWishedHeroStep(ctx) {
      const gameId = ctx.gameId;
      const playerIndex = ctx.playerIndex;
      const wishedHeroStep = ctx.heroJourney[0];

      debug('triggerWishedHeroStep: ctx:', ctx);
      walkie.triggerEvent('wishedHeroStep_', 'wishedHeroJourney.js', {
        gameId: gameId,
        playerIndex: playerIndex,
        wishedHeroStep: wishedHeroStep
      });

      waitBeforeChecking(ctx);
    }

    function waitBeforeChecking(ctx) {
      setTimeout(() => {
        debug('******************** after timeout ********************');
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
      const wishedHeroStep = ctx.heroJourney[0];
      if (heroNew.x === wishedHeroStep.toX) {
        if (heroNew.y === wishedHeroStep.toY) {
          debug('checkWasHeroMoved: Yes!');
          // done (next iteration)!
          // and then
          unsetIsBegingMoved(ctx);
          return;
        }
      }

      debug('checkWasHeroMoved: No!');
      unsetIsBegingMoved(ctx);
    }

    function unsetIsBegingMoved(ctx) {
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
          debug('unsetIsBegingMoved: Done! | error: ', error);
          // done (next iteration)!
        }
      );
    }
  };
};
