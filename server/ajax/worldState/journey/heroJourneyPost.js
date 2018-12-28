// @format

'use strict';

const debug = require('debug')('cogs:heroJourneyPost');
const validator = require('validator');

// What does this module do?
// Endpoint, accepts wished hero journey for a hero, initial verifies, sends responce and passes to next
module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('init');
      checkRequestBodyHeroJourney();
    })();

    function checkRequestBodyHeroJourney() {
      const heroJourney = [];
      let isError = false;

      req.body.heroJourney.forEach((step) => {
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
          debug('POST parameter heroJourney not valid');
          isError = true;
          return;
        }

        const parsedStep = {};
        parsedStep.fromX = parseInt(step.fromX, 10);
        parsedStep.fromY = parseInt(step.fromY, 10);
        parsedStep.toX = parseInt(step.toX, 10);
        parsedStep.toY = parseInt(step.toY, 10);
        heroJourney.push(parsedStep);
      });

      if (isError) {
        res.status(400);
        res.send({
          error: 'POST parameter error, heroJourney parameter not valid'
        });
        debug('******************** error ********************');
        return;
      }
      res.locals.heroJourney = heroJourney;

      debug('checkRequestBodyHeroJourney: req.body', req.body);
      checkRequestBodyHeroId();
    }

    function checkRequestBodyHeroId() {
      const heroId = req.body.heroId;

      if (typeof heroId === 'undefined') {
        res.status(400);
        res.send({ error: 'POST parameter error, heroId parameter not valid' });
        debug('******************** error ********************');
        return;
      }
      res.locals.heroId = heroId;

      debug('checkRequestBodyHeroId: heroId', heroId);
      sendResponce();
    }

    function sendResponce() {
      debug('sendResponce');
      res.send({ error: 0 });
      next();
    }
  };
};
