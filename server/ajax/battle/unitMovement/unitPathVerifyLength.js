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
      next();
    }
  };
};
