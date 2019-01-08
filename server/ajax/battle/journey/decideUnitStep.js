// @format

'use strict';

const debug = require('debug')('cogs:decideUnitStep');
const _ = require('lodash');

// What does this module do?
// Library that works on callback. It decides what to do with wished unit step.
// Is step possible? Decide what will happen!
module.exports = (db) => {
  return (gameId, playerId, unitId, wishedUnitStep, callback) => {
    (function init() {
      debug('init');
      findGameById();
    })();

    // cannot use entities injected above, because unit position changes in db for each step
    function findGameById() {
      const query = { _id: gameId };
      const options = {};

      db.collection('gameCollection').findOne(
        query,
        options,
        (error, entities) => {
          debug('findGameById: error: ', error);
          debug('findGameById', entities._id);
          checkUnitMovementPoints(entities);
        }
      );
    }

    function checkUnitMovementPoints(entities) {
      const unit = entities[unitId];

      if (unit.unitStats.current.movement < 1) {
        const message = 'No movement points left';
        debug('checkUnitMovementPoints: ', message);
        callback(message);
        return;
      }

      debug(
        'checkUnitMovementPoints: unit.unitStats.current.movement:',
        unit.unitStats.current.movement
      );
      checkIsUnitWishedPositionPossible(entities);
    }

    function checkIsUnitWishedPositionPossible(entities) {
      const mapWidth = 20;
      const mapHeight = 1;

      debug(
        'checkIsUnitWishedPositionPossible: wishedUnitStep.toY',
        wishedUnitStep.toY,
        'wishedUnitStep.toX:',
        wishedUnitStep.toX
      );
      if (
        wishedUnitStep.toY < 0 ||
        wishedUnitStep.toY > mapHeight - 1 ||
        wishedUnitStep.toX < 0 ||
        wishedUnitStep.toX > mapWidth - 1
      ) {
        let message = 'Map position not found: toY, toX: ';
        message += wishedUnitStep.toY;
        message += ' ';
        message += wishedUnitStep.toX;
        debug('checkIsUnitWishedPositionPossible: ', message);
        callback(message);
        return;
      }

      debug(
        'checkIsUnitWishedPositionPossible: wishedUnitStep:',
        wishedUnitStep
      );
      checkIsUnitOneStepFromWishedPosition(entities);
    }

    function checkIsUnitOneStepFromWishedPosition(entities) {
      const unit = entities[unitId];

      debug(
        'checkIsUnitOneStepFromWishedPosition: unit.position.x:',
        unit.position.x,
        'unit.position.y:',
        unit.position.y
      );
      const distanceX = Math.abs(unit.position.x - wishedUnitStep.toX);
      const distanceY = Math.abs(unit.position.y - wishedUnitStep.toY);

      if (distanceX !== 0 && distanceX !== 1) {
        const message = 'Cannot move more than one step';
        debug(
          'checkIsUnitOneStepFromWishedPosition: ',
          message,
          wishedUnitStep
        );
        callback(message);
        return;
      }

      if (distanceY !== 0 && distanceY !== 1) {
        const message = 'Cannot move more than one step';
        debug(
          'checkIsUnitOneStepFromWishedPosition: ',
          message,
          wishedUnitStep
        );
        callback(message);
        return;
      }

      debug(
        'checkIsUnitOneStepFromWishedPosition: distanceX',
        distanceX,
        'distanceY',
        distanceY
      );
      checkIsWishedPositionCollidable(entities);
    }

    function checkIsWishedPositionCollidable(entities) {
      let isWishedPositionCollidable = false;

      _.forEach(entities, (entity) => {
        if (entity.figure) {
          if (
            entity.position.x === wishedUnitStep.toX &&
            entity.position.y === wishedUnitStep.toY
          ) {
            if (entity.collision === true) {
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
        message += wishedUnitStep.toY;
        message += ' ';
        message += wishedUnitStep.toX;

        debug('checkIsWishedPositionCollidable', message);
        callback(message);
        return;
      }

      moveUnitToNewPosition();
    }

    function moveUnitToNewPosition() {
      const position = {};
      position.x = wishedUnitStep.toX;
      position.y = wishedUnitStep.toY;

      updateUnitPosition(gameId, unitId, position, (error) => {
        if (error) {
          debug('moveUnitToNewPosition: error:', error);
          callback(error);
          return;
        }

        debug('moveUnitToNewPosition');
        callback(null);
      });
    }
  };
};
