// @format

'use strict';

const debug = require('debug')('cogs:movementTimeout');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Waits some time (for animation on front), and passes to next');

      waitSomeTime();
    })();

    function waitSomeTime() {
      debug('waitSomeTime');
      next();
    }
  };
};
