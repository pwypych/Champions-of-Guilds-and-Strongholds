// @format

'use strict';

const debug = require('debug')('cogs:pathVerify');
const validator = require('validator');
const _ = require('lodash');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Verifies: request.body, movement points, map boundaries, start position, consistency, collisions'
      );
      const entities = res.locals.entities;
      const unitId = res.locals.unitId;

      verifyRequestBody(entities, unitId);
    })();

    function verifyRequestBody(entities, unitId) {
      const unitPath = [];
      let isError = false;

      req.body.unitPath.forEach((position) => {
        if (
          typeof position.x === 'undefined' ||
          typeof position.y === 'undefined' ||
          !validator.isNumeric(position.x) ||
          !validator.isNumeric(position.y)
        ) {
          debug('POST parameter unitPath not valid!', req.body.unitPath);
          isError = true;
          return;
        }

        const parsedPosition = {};
        parsedPosition.x = parseInt(position.x, 10);
        parsedPosition.y = parseInt(position.y, 10);
        unitPath.push(parsedPosition);
      });

      if (isError) {
        res.status(400);
        res.send({
          error: 'POST parameter error, unitPath parameter not valid'
        });
        debug('******************** error ********************');
        return;
      }

      res.locals.unitPath = unitPath;

      debug('verifyRequestBody: unitPath.length', unitPath.length);
      limitByMovementPoints(entities, unitId, unitPath);
    }

    function limitByMovementPoints(entities, unitId, unitPathOriginal) {
      const unit = entities[unitId];
      const stepAmount = unitPathOriginal.length - 1;
      const unitMovement = unit.unitStats.current.movement;

      let unitPath;

      if (unitMovement < stepAmount) {
        unitPath = unitPathOriginal.slice(0, unitMovement + 1);
        res.locals.unitPath = unitPath;
      } else {
        unitPath = unitPathOriginal;
      }

      debug('limitByMovementPoints', unitMovement, stepAmount);
      verifyInsideMapBoundaries(entities, unitId, unitPath);
    }

    function verifyInsideMapBoundaries(entities, unitId, unitPath) {
      let battleWidth;
      let battleHeight;

      _.forEach(entities, (entity) => {
        if (entity.battleStatus === 'active') {
          battleWidth = entity.battleWidth;
          battleHeight = entity.battleHeight;
        }
      });

      let isOutsideMapBoundaries = false;

      _.forEach(unitPath, (position) => {
        if (
          position.y < 0 ||
          position.y > battleHeight - 1 ||
          position.x < 0 ||
          position.x > battleWidth - 1
        ) {
          isOutsideMapBoundaries = true;
        }
      });

      if (isOutsideMapBoundaries) {
        debug(
          'verifyInsideMapBoundaries: A position is outside of boundaries!'
        );
        res.send({
          error: 1,
          message: 'Path position outside of map'
        });
        return;
      }

      debug('verifyInsideMapBoundaries: Inside map boundaries!');
      verifyStartPosition(entities, unitId, unitPath);
    }

    function verifyStartPosition(entities, unitId, unitPath) {
      const position = unitPath[0];
      const entity = entities[unitId];

      if (
        position.x !== entity.position.x ||
        position.y !== entity.position.y
      ) {
        debug('verifyStartPosition: Not equal unit position!');
        res.send({
          error: 1,
          message: 'Path start position not equal unit position'
        });
        return;
      }

      verifyConsistency(entities, unitId, unitPath);
    }

    function verifyConsistency(entities, unitId, unitPath) {
      let isNotConsistent = false;

      _.forEach(unitPath, (position, index) => {
        if (index === 0) {
          return;
        }

        const prevPosition = unitPath[index - 1];

        const distanceX = Math.abs(prevPosition.x - position.x);
        const distanceY = Math.abs(prevPosition.y - position.y);

        // allow only up, down, left, right, no diagonals
        if (
          (distanceX !== 1 || distanceY !== 0) &&
          (distanceY !== 1 || distanceX !== 0)
        ) {
          debug(
            'verifyConsistency: Positions are not one step from each other!',
            prevPosition,
            position
          );
          isNotConsistent = true;
        }
      });

      if (isNotConsistent) {
        res.send({
          error: 1,
          message: 'Path positions not consistent'
        });
        return;
      }

      debug('verifyConsistency: Consistent!');
      verifyCollision(entities, unitId, unitPath);
    }

    function verifyCollision(entities, unitId, unitPath) {
      let isCollision = false;
      _.forEach(unitPath, (position, index) => {
        if (index === 0) {
          return;
        }

        _.forEach(entities, (entity) => {
          if (entity.unitName && entity.collision && entity.position) {
            if (
              entity.position.x === position.x &&
              entity.position.y === position.y
            ) {
              isCollision = index;
            }
          }
        });
      });

      if (isCollision) {
        debug('verifyCollision: Collistion on path!');
        res.send({ error: 1, message: 'Collistion on chosen path' });
        return;
      }

      if (!isCollision) {
        debug('verifyCollision: No collistions!');
      }

      next();
    }
  };
};
