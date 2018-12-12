// @format

'use strict';

const debug = require('debug')('cogs:wishedHeroJourney');
const async = require('async');

// What does this module do?
// Get wishedHeroJourney and emmit event that move hero by one step
module.exports = (walkie, db) => {
  return () => {
    // NIE MOŻE BYĆ DO GLOBALA BO LISTENER
    let gameId;
    let heroJourney;
    let playerIndex;

    (function init() {
      debug('init');
      onWishedHeroJourney();
    })();

    function onWishedHeroJourney() {
      walkie.onEvent('wishedHeroJourney_', 'wishedHeroJourney.js', (data) => {
        gameId = data.gameId;
        heroJourney = data.heroJourney;
        playerIndex = data.playerIndex;
        debug('onWishedHeroJourney');
        findGameById();
      });
    }

    function findGameById() {
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
        checkWishedHeroJourneyListenerWorking(game);
      });
    }

    function checkWishedHeroJourneyListenerWorking(game) {
      const wishedHeroJourneyListenerWorking =
        game.playerArray[playerIndex].hero.wishedHeroJourneyListenerWorking;

      if (wishedHeroJourneyListenerWorking) {
        debug('Hero in beeing moved right now');
        return;
      }

      forEachWishedHeroJourney();
    }

    function forEachWishedHeroJourney() {
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

    function findCurrentHeroPosition(done) {
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
        wasHeroMoved(game.playerArray[playerIndex].hero);
      });
    }

    function wasHeroMoved(hero) {}

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
