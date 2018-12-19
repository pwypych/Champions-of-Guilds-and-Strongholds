// @format

'use strict';

const debug = require('debug')('cogs:heroJourneyPost');
const validator = require('validator');

// What does this module do?
// Endpoint, accepts wished hero journey for a hero, initial verifies, triggers wishedHeroJourney_
module.exports = (walkie) => {
  return (req, res) => {
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
        res.send({ error: 'POST parameter error' });
        debug('******************** error ********************');
        return;
      }

      debug('checkRequestBodyHeroJourney: heroJourney', heroJourney);
      checkRequestBodyHeroId(heroJourney);
    }

    function checkRequestBodyHeroId(heroJourney) {
      const heroId = req.body.heroId;

      if (typeof heroId === 'undefined') {
        res.status(400);
        res.send({ error: 'POST parameter error' });
        debug('******************** error ********************');
        return;
      }

      debug('checkRequestBodyHeroId: heroId', heroId);
      triggerWishedHeroJourney(heroJourney, heroId);
    }

    function triggerWishedHeroJourney(heroJourney, heroId) {
      const entities = res.locals.entities;
      const playerId = res.locals.playerId;
      res.send({ error: 0 });
      debug('triggerWishedHeroJourney');
      walkie.triggerEvent(
        'wishedHeroJourney_',
        'heroJourneyPost.js',
        {
          gameId: entities._id,
          playerId: playerId,
          heroJourney: heroJourney,
          heroId: heroId
        },
        false
      );
    }
  };
};
