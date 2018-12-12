// @format

'use strict';

const debug = require('debug')('cogs:wishedHeroJourney');
const async = require('async');

// What does this module do?
// Get wishedHeroJourney and emmit event that move hero by one step
module.exports = (walkie, db) => {
  return () => {
    (function init() {
      debug('init');
      onWishedHeroJourney();
    })();

    function onWishedHeroJourney() {
      walkie.onEvent('wishedHeroJourney_', 'wishedHeroJourney.js', (data) => {
        const gameId = data.gameId;
        const heroJourney = data.heroJourney;
        const playerIndex = data.playerIndex;
        debug('onWishedHeroJourney');
        findGameById(gameId, heroJourney, playerIndex);
      });
    }

    function findGameById(gameId, heroJourney, playerIndex) {
      const query = { _id: gameId };
      const options = {};

      db.collection('gameCollection').findOne(query, options, (error, game) => {
        if (error) {
          debug('findGameById: error:', error);
          return;
        }

        if (!game) {
          debug('game object is empty');
          return;
        }

        debug('findGameById', game._id);
        checkWishedHeroJourneyListenerWorking(
          gameId,
          heroJourney,
          playerIndex,
          game.playerArray[playerIndex].hero
        );
      });
    }

    function checkWishedHeroJourneyListenerWorking(
      gameId,
      heroJourney,
      playerIndex,
      hero
    ) {
      if (hero.wishedHeroJourneyListenerWorking) {
        debug('Hero in beeing moved right now');
        return;
      }

      compareHeroPositionWithJourneyFirstStepFrom(
        gameId,
        heroJourney,
        playerIndex,
        hero
      );
    }

    function compareHeroPositionWithJourneyFirstStepFrom(
      gameId,
      heroJourney,
      playerIndex,
      hero
    ) {
      if (heroJourney[0].fromX !== hero.x || heroJourney[0].fromY !== hero.y) {
        debug(
          'compareHeroPositionWithJourneyFirstStepFrom: hero position error:'
        );
        return;
      }

      triggerWishedHeroStep(gameId, heroJourney, playerIndex);
    }

    function forEachWishedHeroJourney(gameId, heroJourney, playerIndex) {
      async.eachSeries(
        heroJourney,
        (wishedStep, done) => {
          findCurrentHeroPosition(wishedStep, done);
        },
        (error) => {
          debug('done');
          res.send({ error: 0 });
        }
      );
    }

    function triggerWishedHeroStep(gameId, heroJourney, playerIndex) {
      debug('triggerWishedHeroStep');

      walkie.triggerEvent('wishedHeroStep', 'wishedHeroJourney.js', {
        gameId: gameId,
        playerIndex: playerIndex,
        wishedHeroStep: heroJourney[0]
      });
    }

    function findCurrentHeroPosition(gameId, heroJourney, playerIndex) {
      const query = { _id: gameId };
      const options = {};

      db.collection('gameCollection').findOne(query, options, (error, game) => {
        if (error) {
          debug('findGameById: error:', error);
          return;
        }

        if (!game) {
          debug('game object is empty');
          return;
        }

        debug('findGameById', game._id);
        wasHeroMoved(
          gameId,
          heroJourney,
          playerIndex,
          game.playerArray[playerIndex].hero
        );
      });
    }

    function wasHeroMoved(gameId, heroJourney, playerIndex, hero) {}

    function triggerWishedHeroStep(game) {
      debug('triggerWishedHeroStep');

      walkie.triggerEvent('wishedHeroStep', 'wishedHeroJourney.js', {
        gameId: game._id,
        playerIndex: playerIndex,
        wishedHeroStep: heroJourney
      });
    }
  };
};
