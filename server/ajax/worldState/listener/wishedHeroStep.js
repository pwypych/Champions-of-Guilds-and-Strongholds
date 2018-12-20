// @format

'use strict';

const debug = require('debug')('cogs:wishedHeroStep');
const _ = require('lodash');

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
        ctx.playerId = data.playerId;
        ctx.heroId = data.heroId;

        debug('onWishedHeroStep: wishedHeroStep:', ctx.wishedHeroStep);
        debug('onWishedHeroStep: gameId:', ctx.gameId);
        debug('onWishedHeroStep: heroId:', ctx.heroId);
        debug('onWishedHeroStep: playerId:', ctx.playerId);
        findGameById(ctx);
      });
    }

    function findGameById(ctx) {
      const gameId = ctx.gameId;
      const heroId = ctx.heroId;

      const query = { _id: gameId };
      const options = {};

      db.collection('gameCollection').findOne(
        query,
        options,
        (error, entities) => {
          debug('findGameById: gameId:', entities._id, ' | error: ', error);
          ctx.entities = entities;
          ctx.hero = entities[heroId];

          debug('findGameById', entities._id);
          debug('findGameById:ctx.hero:', ctx.hero);
          checkIsHeroWishedPositionPossible(ctx);
        }
      );
    }

    function checkIsHeroWishedPositionPossible(ctx) {
      const gameId = ctx.gameId;
      const gameEntity = ctx.entities[gameId];
      const wishedHeroStep = ctx.wishedHeroStep;
      const mapWidth = gameEntity.mapData.width - 1;
      const mapHeight = gameEntity.mapData.height - 1;

      debug(
        'checkIsHeroWishedPositionPossible: wishedHeroStep.toY',
        wishedHeroStep.toY,
        'wishedHeroStep.toX:',
        wishedHeroStep.toX
      );
      if (
        wishedHeroStep.toY < 0 ||
        wishedHeroStep.toY > mapHeight ||
        wishedHeroStep.toX < 0 ||
        wishedHeroStep.toX > mapWidth
      ) {
        debug(
          'checkIsHeroWishedPositionPossible: map position not found: toY, toX:',
          wishedHeroStep.toY,
          wishedHeroStep.toX
        );
        return;
      }

      debug(
        'checkIsHeroWishedPositionPossible: wishedHeroStep:',
        wishedHeroStep
      );
      checkIsHeroOneStepFromWishedPosition(ctx);
    }

    function checkIsHeroOneStepFromWishedPosition(ctx) {
      const hero = ctx.hero;
      const wishedHeroStep = ctx.wishedHeroStep;

      debug(
        'checkIsHeroOneStepFromWishedPosition: hero.position.x:',
        hero.position.x,
        'hero.position.y:',
        hero.position.y
      );
      const distanceX = Math.abs(hero.position.x - wishedHeroStep.toX);
      const distanceY = Math.abs(hero.position.y - wishedHeroStep.toY);

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
      checkIsWishedPositionCollidable(ctx);
    }

    function checkIsWishedPositionCollidable(ctx) {
      const entities = ctx.entities;
      const wishedHeroStep = ctx.wishedHeroStep;
      let isWishedPositionCollidable = false;

      _.forEach(entities, (entitiy) => {
        if (entitiy.figure) {
          if (
            entitiy.position.x === wishedHeroStep.toX &&
            entitiy.position.y === wishedHeroStep.toY
          ) {
            if (entitiy.collision === true) {
              isWishedPositionCollidable = true;
            }
          }
        }
      });

      debug(
        'checkIsWishedPositionCollidable: isWishedPositionCollidable:',
        isWishedPositionCollidable
      );
      if (isWishedPositionCollidable) {
        debug(
          'checkIsWishedPositionCollidable: cannot move because collision on: moveToY, moveToX:',
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
      const playerId = ctx.playerId;
      const heroId = ctx.heroId;
      const wishedHeroStep = ctx.wishedHeroStep;

      walkie.triggerEvent('verifiedHeroStep_', 'wishedHeroStep.js', {
        gameId: gameId,
        playerId: playerId,
        heroId: heroId,
        verifiedHeroStep: wishedHeroStep
      });
    }
  };
};
