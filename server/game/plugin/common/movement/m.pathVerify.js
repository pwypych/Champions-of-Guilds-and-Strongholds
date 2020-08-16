// @format

'use strict';

const debug = require('debug')('cogs:pathVerify');
const validator = require('validator');
const _ = require('lodash');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Verifies: request.body, map boundaries, start position, consistency'
      );
      const entities = res.locals.entities;
      const entityId = res.locals.entityId;

      verifyRequestBody(entities, entityId);
    })();

    function verifyRequestBody(entities, entityId) {
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
      verifyPathLength(entities, entityId, path);
    }

    function verifyPathLength(entities, entityId, path) {
      if (path.length < 2) {
        debug('verifyPathLength: Path is less than one step!', path.length);
        res.send({
          error: 1,
          message: 'Path is too short'
        });
        return;
      }

      debug('verifyPathLength: path.length:', path.length);
      verifyInsideMapBoundaries(entities, entityId, path);
    }

    function verifyInsideMapBoundaries(entities, entityId, path) {
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
      verifyStartPosition(entities, entityId, path);
    }

    function verifyStartPosition(entities, entityId, path) {
      const position = path[0];
      const entity = entities[entityId];

      if (
        position.x !== entity.position.x ||
        position.y !== entity.position.y
      ) {
        debug('verifyStartPosition: Not equal entity position!');
        res.send({
          error: 1,
          message: 'Path start position not equal entity position'
        });
        return;
      }

      debug('verifyStartPosition: Entity present on start position!');
      verifyConsistency(entities, entityId, path);
    }

    function verifyConsistency(entities, entityId, path) {
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
      next();
    }
  };
};
