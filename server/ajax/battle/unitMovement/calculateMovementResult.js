// @format

'use strict';

const debug = require('debug')('cogs:calculateMovementResult');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Calculates where journey move will end, and how long will it take and adds moveTo and time to locals'
      );

      const unitJourney = res.locals.unitJourney;

      sendResponce();
    })();

    function sendResponce() {
      debug('sendResponce: No Errors!');
      res.send({ error: 0 });
      next();
    }
  };
};
