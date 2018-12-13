// @format

'use strict';

const debug = require('debug')('cogs:wishedHeroStep');

// What does this module do?
// Verify wishedHeroStep_ and decide what to do
module.exports = (walkie, db) => {
  return () => {
    (function init() {
      debug('init');
      onWishedHeroStep();
    })();

    function onWishedHeroStep() {
      walkie.onEvent(
        'wishedHeroStep_',
        'wishedHeroStep.js',
        (data) => {
          const gameId = data.gameId;
          const wishedHeroStep = data.wishedHeroStep;
          const playerIndex = data.playerIndex;

          debug('onWishedHeroStep: wishedHeroStep:', wishedHeroStep);
          debug('onWishedHeroStep: gameId:', gameId);
          debug('onWishedHeroStep: playerIndex:', playerIndex);
          findGameById(gameId, wishedHeroStep, playerIndex);
        },
        false
      );
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
          debug('findGameById: game object is empty');
          return;
        }

        debug('findGameById', game._id);
        checkIsHeroWishedPositionPossible(
          gameId,
          heroJourney,
          playerIndex,
          game
        );
      });
    }

    function checkIsHeroWishedPositionPossible(
      gameId,
      wishedHeroStep,
      playerIndex,
      game
    ) {
      if (
        !game.mapLayer[wishedHeroStep.toY] ||
        !game.mapLayer[wishedHeroStep.toY][wishedHeroStep.toX]
      ) {
        debug(
          'checkIsHeroWishedPositionPossible: map position not found: moveToY, moveToX:',
          wishedHeroStep.toY,
          wishedHeroStep.toX
        );
        return;
      }

      debug('checkIsHeroWishedPositionPossible:', wishedHeroStep);
      checkIsHeroOneStepFromWishedPosition(
        gameId,
        wishedHeroStep,
        playerIndex,
        game
      );
    }

    function checkIsHeroOneStepFromWishedPosition(
      gameId,
      wishedHeroStep,
      playerIndex,
      game
    ) {
      const hero = game.playerArray[playerIndex].hero;
      const distanceX = Math.abs(hero.x - wishedHeroStep.toX);
      const distanceY = Math.abs(hero.y - wishedHeroStep.toY);

      if (distanceX !== 0 && distanceX !== 1) {
        debug(
          'checkIsHeroOneStepFromWishedPosition: cannot move more than one step:',
          wishedHeroStep.toY,
          wishedHeroStep.toX
        );
        return;
      }

      if (distanceY !== 0 && distanceY !== 1) {
        debug(
          'checkIsHeroOneStepFromWishedPosition: cannot move more than one step:',
          wishedHeroStep.toY,
          wishedHeroStep.toX
        );
        return;
      }

      debug(
        'checkIsHeroOneStepFromWishedPosition: distanceX',
        distanceX,
        'distanceY',
        distanceY
      );
      checkIsHeroWishedPositionEmpty(gameId, wishedHeroStep, playerIndex, game);
    }

    function checkIsHeroWishedPositionEmpty(
      gameId,
      wishedHeroStep,
      playerIndex,
      game
    ) {
      if (game.mapLayer[wishedHeroStep.toY][wishedHeroStep.toX].collision) {
        debug(
          'checkIsHeroWishedPositionPossible: cannot move because collision on: moveToY, moveToX:',
          wishedHeroStep.toY,
          wishedHeroStep.toX
        );
        return;
      }
      triggerVerifiedHeroStep(gameId, wishedHeroStep, playerIndex);
    }

    function triggerVerifiedHeroStep(gameId, wishedHeroStep, playerIndex) {
      debug('triggerVerifiedHeroStep');

      walkie.triggerEvent(
        'verifiedHeroStep_',
        'wishedHeroStep.js',
        {
          gameId: gameId,
          playerIndex: playerIndex,
          verifiedHeroStep: wishedHeroStep
        },
        false
      );
    }
  };
};
