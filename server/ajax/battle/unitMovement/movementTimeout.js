// @format

'use strict';

const debug = require('debug')('cogs:movementTimeout');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Waits some time (for animation on front), and passes to next');
      const unitPath = res.locals.unitPath;

      calculateWaitTime(unitPath);
    })();

    function calculateWaitTime(unitPath) {
      const waitTime = (unitPath.length - 1) * 150;

      debug('calculateWaitTime: waitTime:', waitTime);
      waitSomeTime(waitTime);
    }

    function waitSomeTime(waitTime) {
      debug('waitSomeTime: Start!');
      setTimeout(() => {
        debug('waitSomeTime: Finish!');
        next();
      }, waitTime);
    }
  };
};
