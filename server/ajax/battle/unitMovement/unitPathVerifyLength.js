// @format

'use strict';

const debug = require('debug')('cogs:unitPathVerifyLength');
const validator = require('validator');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Initially verifies unitPath, checks unit movement points, and verifies if path is not too long'
      );

      checkRequestBodyUnitJourney();
    })();

    function checkRequestBodyUnitJourney() {
      const unitPath = [];
      let isError = false;

      req.body.unitPath.forEach((step) => {
        if (
          typeof step.fromX === 'undefined' ||
          typeof step.fromY === 'undefined' ||
          typeof step.toX === 'undefined' ||
          typeof step.toY === 'undefined' ||
          !validator.isNumeric(step.fromX) ||
          !validator.isNumeric(step.fromY) ||
          !validator.isNumeric(step.toX) ||
          !validator.isNumeric(step.toY)
        ) {
          debug('POST parameter unitPath not valid!', unitPath);
          isError = true;
          return;
        }

        const parsedStep = {};
        parsedStep.fromX = parseInt(step.fromX, 10);
        parsedStep.fromY = parseInt(step.fromY, 10);
        parsedStep.toX = parseInt(step.toX, 10);
        parsedStep.toY = parseInt(step.toY, 10);
        unitPath.push(parsedStep);
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

      debug('checkRequestBodyUnitJourney: unitPath', unitPath);
      next();
    }
  };
};
