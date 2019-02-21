// @format

'use strict';

const debug = require('debug')('cogs:unitPathVerify');
const validator = require('validator');
const _ = require('lodash');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Initially verifies unitPath, checks unit movement points, and verifies if path is not too long'
      );
      const entities = res.locals.entities;
      const unitId = res.locals.unitId;

      checkRequestBodyUnitJourney(entities, unitId);
    })();

    function checkRequestBodyUnitJourney(entities, unitId) {
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

      debug('checkRequestBodyUnitJourney: unitPath.length', unitPath.length);
      limitUnitPathByMovementPoints(entities, unitId, unitPath);
    }

    function limitUnitPathByMovementPoints(entities, unitId, unitPathOriginal) {
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

      debug('limitUnitPathByMovementPoints', unitMovement, stepAmount);
      verifyUnitPathInsideMapBoundaries(entities, unitId, unitPath);
    }

    function verifyUnitPathInsideMapBoundaries(entities, unitId, unitPath) {
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
          'verifyUnitPathInsideMapBoundaries: A position is outside of boundaries!'
        );
        res.send({
          error: 1,
          message: 'Path position outside of map'
        });
        return;
      }

      debug('verifyUnitPathInsideMapBoundaries: Okey!');
      verifyUnitPathStartPosition(entities, unitId, unitPath);
    }

    function verifyUnitPathStartPosition(entities, unitId, unitPath) {
      const position = unitPath[0];
      const entity = entities[unitId];

      if (
        position.x !== entity.position.x ||
        position.y !== entity.position.y
      ) {
        debug('verifyUnitPathStartPosition: Not equal unit position!');
        res.send({
          error: 1,
          message: 'Path start position not equal unit position'
        });
        return;
      }

      verifyUnitPathConsistency(entities, unitId, unitPath);
    }

    function verifyUnitPathConsistency(entities, unitId, unitPath) {
      debug('verifyUnitPathConsistency');
      verifyUnitPathCollision(entities, unitId, unitPath);
    }

    function verifyUnitPathCollision(entities, unitId, unitPath) {
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
        debug('verifyUnitPathCollision: Collistion on path!');
        res.send({ error: 1, message: 'Collistion on chosen path' });
        return;
      }

      if (!isCollision) {
        debug('verifyUnitPathCollision: No collistions!');
      }

      next();
    }
  };
};
