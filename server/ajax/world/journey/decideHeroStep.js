// @format

'use strict';

const debug = require('debug')('cogs:decideHeroStep');
const _ = require('lodash');

// What does this module do?
// Library that works on callback. It decides what to do with wished hero step.
// Was journey canselled? Is step possible? Decide what will happen!
module.exports = (db, updateHeroPosition) => {
  return (gameId, heroId, wishedHeroStep, callback) => {
    (function init() {
      debug('init');
      findGameById();
    })();

    // cannot use entities injected above, because hero position changes in db for each step
    function findGameById() {
      const query = { _id: gameId };
      const options = {};

      db.collection('gameCollection').findOne(
        query,
        options,
        (error, entities) => {
          debug('findGameById: error: ', error);
          debug('findGameById', entities._id);
          checkHeroMovementPoints(entities);
        }
      );
    }

    function checkHeroMovementPoints(entities) {
      const hero = entities[heroId];

      if (hero.heroStats.movement < 1) {
        const message = 'No movement points left';
        debug('checkHeroMovementPoints: ', message);
        callback(message);
        return;
      }

      debug(
        'checkHeroMovementPoints: hero.heroStats.movement:',
        hero.heroStats.movement
      );
      checkIsHeroWishedPositionPossible(entities);
    }

    function checkIsHeroWishedPositionPossible(entities) {
      const gameEntity = entities[gameId];
      const mapWidth = gameEntity.mapData.width;
      const mapHeight = gameEntity.mapData.height;

      debug(
        'checkIsHeroWishedPositionPossible: wishedHeroStep.toY',
        wishedHeroStep.toY,
        'wishedHeroStep.toX:',
        wishedHeroStep.toX
      );
      if (
        wishedHeroStep.toY < 0 ||
        wishedHeroStep.toY > mapHeight - 1 ||
        wishedHeroStep.toX < 0 ||
        wishedHeroStep.toX > mapWidth - 1
      ) {
        let message = 'Map position not found: toY, toX: ';
        message += wishedHeroStep.toY;
        message += ' ';
        message += wishedHeroStep.toX;
        debug('checkIsHeroWishedPositionPossible: ', message);
        callback(message);
        return;
      }

      debug(
        'checkIsHeroWishedPositionPossible: wishedHeroStep:',
        wishedHeroStep
      );
      checkIsHeroOneStepFromWishedPosition(entities);
    }

    function checkIsHeroOneStepFromWishedPosition(entities) {
      const hero = entities[heroId];

      debug(
        'checkIsHeroOneStepFromWishedPosition: hero.position.x:',
        hero.position.x,
        'hero.position.y:',
        hero.position.y
      );
      const distanceX = Math.abs(hero.position.x - wishedHeroStep.toX);
      const distanceY = Math.abs(hero.position.y - wishedHeroStep.toY);

      if (distanceX !== 0 && distanceX !== 1) {
        const message = 'Cannot move more than one step';
        debug(
          'checkIsHeroOneStepFromWishedPosition: ',
          message,
          wishedHeroStep
        );
        callback(message);
        return;
      }

      if (distanceY !== 0 && distanceY !== 1) {
        const message = 'Cannot move more than one step';
        debug(
          'checkIsHeroOneStepFromWishedPosition: ',
          message,
          wishedHeroStep
        );
        callback(message);
        return;
      }

      debug(
        'checkIsHeroOneStepFromWishedPosition: distanceX',
        distanceX,
        'distanceY',
        distanceY
      );
      checkIsWishedPositionCollidable(entities);
    }

    function checkIsWishedPositionCollidable(entities) {
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
        let message = 'Cannot move because collision on wished step: ';
        message += wishedHeroStep.toY;
        message += ' ';
        message += wishedHeroStep.toX;

        debug('checkIsWishedPositionCollidable', message);
        callback(message);
        return;
      }

      moveHeroToNewPosition();
    }

    function moveHeroToNewPosition() {
      const position = {};
      position.x = wishedHeroStep.toX;
      position.y = wishedHeroStep.toY;

      updateHeroPosition(gameId, heroId, position, (error) => {
        if (error) {
          debug('moveHeroToNewPosition: error:', error);
          callback(error);
          return;
        }

        debug('moveHeroToNewPosition');
        callback(null);
      });
    }
  };
};
