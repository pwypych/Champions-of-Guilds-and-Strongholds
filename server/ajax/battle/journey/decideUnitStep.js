// @format

'use strict';

const debug = require('debug')('cogs:decideUnitStep');
const _ = require('lodash');

// What does this module do?
// Decides what to do with wished unit step. Is step possible? Decide what will happen!
module.exports = (
  db,
  updateUnitPosition,
  decrementUnitMovement,
  findEntitiesByGameId
) => {
  return (gameId, playerId, unitId, wishedUnitStep, callback) => {
    (function init() {
      debug('init');
      runFindEntitiesByGameId();
    })();

    // cannot use entities used in middleware, because unit position changes in db for each step
    function runFindEntitiesByGameId() {
      findEntitiesByGameId(gameId, (error, entities) => {
        debug('runFindEntitiesByGameId: entities._id:', entities._id);
        checkUnitMovementPoints(entities);
      });
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
      let battleWidth;
      let battleHeight;

      _.forEach(entities, (entity) => {
        if (entity.battleStatus === 'active') {
          battleWidth = entity.battleWidth;
          battleHeight = entity.battleHeight;
        }
      });

      debug(
        'checkIsUnitWishedPositionPossible: wishedUnitStep.toY',
        wishedUnitStep.toY,
        'wishedUnitStep.toX:',
        wishedUnitStep.toX
      );
      if (
        wishedUnitStep.toY < 0 ||
        wishedUnitStep.toY > battleHeight - 1 ||
        wishedUnitStep.toX < 0 ||
        wishedUnitStep.toX > battleWidth - 1
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

      debug(
        'checkIsUnitOneStepFromWishedPosition: distanceX',
        distanceX,
        'distanceY',
        distanceY
      );

      // allow only up, down, left, right, no diagonals
      if (
        (distanceX !== 1 || distanceY !== 0) &&
        (distanceY !== 1 || distanceX !== 0)
      ) {
        const message = 'Cannot move more than one step';
        debug(
          'checkIsUnitOneStepFromWishedPosition: ',
          message,
          wishedUnitStep
        );
        callback(message);
        return;
      }

      checkIsWishedPositionCollidable(entities);
    }

    function checkIsWishedPositionCollidable(entities) {
      let isWishedPositionCollidable = false;

      _.forEach(entities, (entity) => {
        if (entity.unitName) {
          if (
            entity.position.x === wishedUnitStep.toX &&
            entity.position.y === wishedUnitStep.toY
          ) {
            if (entity.collision === true) {
              isWishedPositionCollidable = true;
              debug('checkIsWishedPositionCollidable: ', entity);
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

      runDecrementUnitMovement();
    }

    function runDecrementUnitMovement() {
      decrementUnitMovement(gameId, unitId, () => {
        debug('runDecrementUnitMovement: Success!');
        moveUnitToNewPosition();
      });
    }

    function moveUnitToNewPosition() {
      const position = {};
      position.x = wishedUnitStep.toX;
      position.y = wishedUnitStep.toY;

      updateUnitPosition(gameId, unitId, position, () => {
        debug('moveUnitToNewPosition: Success!');
        callback(null);
      });
    }
  };
};
