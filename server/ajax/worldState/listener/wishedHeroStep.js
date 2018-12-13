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
      walkie.onEvent('wishedHeroStep_', 'wishedHeroStep.js', (data) => {
        const ctx = {};
        ctx.gameId = data.gameId;
        ctx.wishedHeroStep = data.wishedHeroStep;
        ctx.playerIndex = data.playerIndex;

        debug('onWishedHeroStep: wishedHeroStep:', ctx.wishedHeroStep);
        debug('onWishedHeroStep: gameId:', ctx.gameId);
        debug('onWishedHeroStep: playerIndex:', ctx.playerIndex);
        findGameById(ctx);
      });
    }

    function findGameById(ctx) {
      const gameId = ctx.gameId;
      const playerIndex = ctx.playerIndex;

      const query = { _id: gameId };
      const options = {};

      db.collection('gameCollection').findOne(query, options, (error, game) => {
        debug('findGameById: gameId:', game._id, ' | error: ', error);
        ctx.mapLayer = game.mapLayer;
        ctx.hero = game.playerArray[playerIndex].hero;

        debug('findGameById', game._id);
        checkIsHeroWishedPositionPossible(ctx);
      });
    }

    function checkIsHeroWishedPositionPossible(ctx) {
      const mapLayer = ctx.mapLayer;
      const wishedHeroStep = ctx.wishedHeroStep;

      if (
        !mapLayer[wishedHeroStep.toY] ||
        !mapLayer[wishedHeroStep.toY][wishedHeroStep.toX]
      ) {
        debug(
          'checkIsHeroWishedPositionPossible: map position not found: moveToY, moveToX:',
          wishedHeroStep.toY,
          wishedHeroStep.toX
        );
        return;
      }

      debug('checkIsHeroWishedPositionPossible:', wishedHeroStep);
      checkIsHeroOneStepFromWishedPosition(ctx);
    }

    function checkIsHeroOneStepFromWishedPosition(ctx) {
      const hero = ctx.hero;
      const wishedHeroStep = ctx.wishedHeroStep;

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
      checkIsHeroWishedPositionEmpty(ctx);
    }

    function checkIsHeroWishedPositionEmpty(ctx) {
      const mapLayer = ctx.mapLayer;
      const wishedHeroStep = ctx.wishedHeroStep;

      if (mapLayer[wishedHeroStep.toY][wishedHeroStep.toX].collision) {
        debug(
          'checkIsHeroWishedPositionPossible: cannot move because collision on: moveToY, moveToX:',
          wishedHeroStep.toY,
          wishedHeroStep.toX
        );
        return;
      }
      triggerWishedHeroStep(ctx);
    }

    function triggerWishedHeroStep(ctx) {
      debug('triggerWishedHeroStep');
      const gameId = ctx.gameId;
      const playerIndex = ctx.playerIndex;
      const wishedHeroStep = ctx.wishedHeroStep;

      walkie.triggerEvent('verifiedHeroStep_', 'wishedHeroStep.js', {
        gameId: gameId,
        playerIndex: playerIndex,
        verifiedHeroStep: wishedHeroStep
      });
    }
  };
};
