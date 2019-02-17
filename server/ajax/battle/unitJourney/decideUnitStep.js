// @format

'use strict';

const debug = require('debug')('cogs:decideUnitStep');
const _ = require('lodash');

module.exports = (
  db,
  findEntitiesByGameId,
  decrementUnitMovement,
  updateUnitPosition
) => {
  return (gameId, playerId, unitId, wishedUnitStep, callback) => {
    (function init() {
      debug(
        '// Decides what to do with wished unit step. Is step possible? Decide what will happen!'
      );

      runFindEntitiesByGameId();
    })();

    // cannot use entities used in middleware, because unit position changes in db for each step
    function runFindEntitiesByGameId() {
      findEntitiesByGameId(gameId, (error, entities) => {
        debug('runFindEntitiesByGameId');
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
        'checkUnitMovementPoints: Points remaining:',
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
        'checkIsUnitWishedPositionPossible: Yes: x:',
        wishedUnitStep.toX,
        'y:',
        wishedUnitStep.toY
      );
      checkIsUnitOneStepFromWishedPosition(entities);
    }

    function checkIsUnitOneStepFromWishedPosition(entities) {
      const unit = entities[unitId];

      const distanceX = Math.abs(unit.position.x - wishedUnitStep.toX);
      const distanceY = Math.abs(unit.position.y - wishedUnitStep.toY);

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

      debug('checkIsUnitOneStepFromWishedPosition: Yes!');
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
              debug('checkIsWishedPositionCollidable: Yes!:', entity);
            }
          }
        }
      });

      if (isWishedPositionCollidable) {
        let message = 'Cannot move because collision on wished step: ';
        message += wishedUnitStep.toY;
        message += ' ';
        message += wishedUnitStep.toX;

        debug('checkIsWishedPositionCollidable', message);
        callback(message);
        return;
      }

      debug('checkIsWishedPositionCollidable: No collision!');
      runDecrementUnitMovement();
    }

    function runDecrementUnitMovement() {
      debug('runDecrementUnitMovement: Starting...');
      decrementUnitMovement(gameId, unitId, () => {
        debug('runDecrementUnitMovement: Success!');
        waitBeforeMove();
      });
    }

    function waitBeforeMove() {
      const unitMoveSpeed = 150; // ms

      setTimeout(() => {
        debug('waitBeforeMove: Waiting 150ms!');
        runUpdateUnitPosition();
      }, unitMoveSpeed);
    }

    function runUpdateUnitPosition() {
      const position = {};
      position.x = wishedUnitStep.toX;
      position.y = wishedUnitStep.toY;

      debug('runUpdateUnitPosition: Starting...');
      updateUnitPosition(gameId, unitId, position, () => {
        debug('runUpdateUnitPosition: Success!');
        callback(null);
      });
    }
  };
};
