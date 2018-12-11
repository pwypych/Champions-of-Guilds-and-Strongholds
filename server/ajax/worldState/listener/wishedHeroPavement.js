// @format

'use strict';

const debug = require('debug')('cogs:wishedHeroPavement');
const async = require('async');

// What does this module do?
// Get wishedHeroPavement and emmit event that move hero by one step
module.exports = (walkie, db) => {
  return () => {
    // NIE MOŻE BYĆ DO GLOBALA BO LISTENER
    let gameId;
    let heroPavement;
    let playerIndex;

    (function init() {
      debug('init');
      onWishedHeroPavement();
    })();

    function onWishedHeroPavement() {
      walkie.onEvent('wishedHeroPavement_', 'wishedHeroPavement.js', (data) => {
        gameId = data.gameId;
        heroPavement = data.heroPavement;
        playerIndex = data.playerIndex;
        debug('onWishedHeroPavement');
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
        checkWishedHeroPavementListenerWorking(game);
      });
    }

    function checkWishedHeroPavementListenerWorking(game) {
      const wishedHeroPavementListenerWorking =
        game.playerArray[playerIndex].hero.wishedHeroPavementListenerWorking;

      if (wishedHeroPavementListenerWorking) {
        debug('Hero in beeing moved right now');
        return;
      }

      forEachWishedHeroPavement();
    }

    function forEachWishedHeroPavement() {
      async.eachSeries(
        heroPavement,
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

      walkie.triggerEvent('wishedHeroStep', 'wishedHeroPavement.js', {
        gameId: game._id,
        playerIndex: playerIndex,
        wishedHeroStep: heroPavement
      });
    }
  };
};
