// @format

'use strict';

const debug = require('debug')('cogs:wishedHeroJourney');
const async = require('async');

// What does this module do?
// Listens to wishedHeroJourney_ and emmits wishedHeroStep_ events by a defined timer
module.exports = (db) => {
  return (res, req, next) => {
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
          waitBeforeChecking(ctx);
        }
      );
    }

    function waitBeforeChecking(ctx) {
      setTimeout(() => {
        debug('waitBeforeChecking: After waiting 500ms!');
        findCurrentHeroPosition(ctx);
      }, 250);
    }

    function findCurrentHeroPosition(ctx) {
      const gameId = ctx.gameId;
      const heroId = ctx.heroId;

      const query = { _id: gameId };
      const options = {};
      const projection = {};
      projection[heroId] = 1;
      options.projection = projection;

      db.collection('gameCollection').findOne(
        query,
        options,
        (error, entities) => {
          debug('findCurrentHeroPosition: error:', error);
          ctx.heroNew = entities[heroId];

          checkWasHeroMoved(ctx);
        }
      );
    }

    function checkWasHeroMoved(ctx) {
      const heroNew = ctx.heroNew;
      const wishedHeroStep = ctx.wishedHeroStep;

      let wasHeroMoved = false;

      if (heroNew.position.x === wishedHeroStep.toX) {
        if (heroNew.position.y === wishedHeroStep.toY) {
          debug('checkWasHeroMoved: Yes!');
          wasHeroMoved = true;
        }
      }

      debug('checkWasHeroMoved: wasHeroMoved:', wasHeroMoved);
      updateUnsetIsBegingMoved(ctx, wasHeroMoved);
    }

    function updateUnsetIsBegingMoved(ctx, wasHeroMoved) {
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
