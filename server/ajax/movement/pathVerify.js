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
      const path = [];
      let isError = false;

      req.body.path.forEach((position) => {
        if (
          typeof position.x === 'undefined' ||
          typeof position.y === 'undefined' ||
          !validator.isNumeric(position.x) ||
          !validator.isNumeric(position.y)
        ) {
          debug('POST parameter path not valid!', req.body.path);
          isError = true;
          return;
        }

        const parsedPosition = {};
        parsedPosition.x = parseInt(position.x, 10);
        parsedPosition.y = parseInt(position.y, 10);
        path.push(parsedPosition);
      });

      if (isError) {
        res.status(400);
        res.send({
          error: 'POST parameter error, path parameter not valid'
        });
        debug('******************** error ********************');
        return;
      }

      res.locals.path = path;

      debug('verifyRequestBody: path.length', path.length);
      limitByMovementPoints(entities, unitId, path);
    }

    function limitByMovementPoints(entities, unitId, pathOriginal) {
      const unit = entities[unitId];
      const stepAmount = pathOriginal.length - 1;
      const unitMovement = unit.unitStats.current.movement;

      let path;

      if (unitMovement < stepAmount) {
        path = pathOriginal.slice(0, unitMovement + 1);
        res.locals.path = path;
      } else {
        path = pathOriginal;
      }

      debug('limitByMovementPoints', unitMovement, stepAmount);
      verifyInsideMapBoundaries(entities, unitId, path);
    }

    function verifyInsideMapBoundaries(entities, unitId, path) {
      let battleWidth;
      let battleHeight;

      _.forEach(entities, (entity) => {
        if (entity.battleStatus === 'active') {
          battleWidth = entity.battleWidth;
          battleHeight = entity.battleHeight;
        }
      });

      let isOutsideMapBoundaries = false;

      _.forEach(path, (position) => {
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
      verifyStartPosition(entities, unitId, path);
    }

    function verifyStartPosition(entities, unitId, path) {
      const position = path[0];
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

      verifyConsistency(entities, unitId, path);
    }

    function verifyConsistency(entities, unitId, path) {
      let isNotConsistent = false;

      _.forEach(path, (position, index) => {
        if (index === 0) {
          return;
        }

        const prevPosition = path[index - 1];

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
      verifyCollision(entities, unitId, path);
    }

    function verifyCollision(entities, unitId, path) {
      let isCollision = false;
      _.forEach(path, (position, index) => {
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
