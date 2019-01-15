// @format

'use strict';

const debug = require('debug')('cogs:unitJourneyPost');
const validator = require('validator');

// What does this module do?
// Endpoint, accepts wished unit journey for a unit, initial verifies, sends response and passes to next
module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('init');
      checkRequestBodyUnitJourney();
    })();

    function checkRequestBodyUnitJourney() {
      const unitJourney = [];
      let isError = false;

      req.body.unitJourney.forEach((step) => {
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
          debug('POST parameter unitJourney not valid');
          isError = true;
          return;
        }

        const parsedStep = {};
        parsedStep.fromX = parseInt(step.fromX, 10);
        parsedStep.fromY = parseInt(step.fromY, 10);
        parsedStep.toX = parseInt(step.toX, 10);
        parsedStep.toY = parseInt(step.toY, 10);
        unitJourney.push(parsedStep);
      });

      if (isError) {
        res.status(400);
        res.send({
          error: 'POST parameter error, unitJourney parameter not valid'
        });
        debug('******************** error ********************');
        return;
      }
      res.locals.unitJourney = unitJourney;

      debug('checkRequestBodyUnitJourney: unitJourney', unitJourney);
      checkRequestBodyUnitId();
    }

    function checkRequestBodyUnitId() {
      const unitId = req.body.unitId;

      if (typeof unitId === 'undefined') {
        res.status(400);
        res.send({ error: 'POST parameter error, unitId parameter not valid' });
        debug('******************** error ********************');
        return;
      }
      res.locals.unitId = unitId;

      debug('checkRequestBodyUnitId: unitId', unitId);
      sendResponce();
    }

    function sendResponce() {
      debug('sendResponce');
      res.send({ error: 0 });
      next();
    }
  };
};
