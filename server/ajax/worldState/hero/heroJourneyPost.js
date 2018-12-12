// @format

'use strict';

const debug = require('debug')('cogs:heroJourneyPost');
const validator = require('validator');

// What does this module do?
// Get herpJourney, make initial verification
module.exports = (walkie) => {
  return (req, res) => {
    const game = res.locals.game;
    const playerIndex = res.locals.playerIndex;

    (function init() {
      debug('init');
      checkRequestBody();
    })();

    function checkRequestBody() {
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

        const varifiedStep = {};
        varifiedStep.fromX = parseInt(step.fromX, 10);
        varifiedStep.fromY = parseInt(step.fromY, 10);
        varifiedStep.toX = parseInt(step.toX, 10);
        varifiedStep.toY = parseInt(step.toY, 10);
        heroJourney.push(varifiedStep);
      });

      if (isError) {
        res.status(400);
        res.send({ error: 'POST parameter error' });
        debug('******************** error ********************');
        return;
      }

      debug('checkRequestBody: heroPathArray', heroJourney);
      sendResponce(heroJourney);
    }

    function sendResponce(heroJourney) {
      res.send({ error: 0 });
      debug('******************** ajax ********************');
      walkie.triggerEvent(
        'wishedHeroJourney_',
        'heroJourneyPost.js',
        {
          gameId: game._id,
          playerIndex: playerIndex,
          heroJourney: heroJourney
        },
        false
      );
    }
  };
};
