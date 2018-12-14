// @format

'use strict';

const debug = require('debug')('nope:cogs:middlewareAjaxStateAuth');

// What does this module do?
// Check that module can be runned with a state send by a user
module.exports = (neededState) => {
  return (req, res, next) => {
    (function init() {
      debug('init');
      compareStates();
    })();

    function compareStates() {
      const _id = res.locals.entities._id;
      const gameState = res.locals.entities[_id].state;

      if (gameState !== neededState) {
        // State is not the same
        debug('compareStates: invalid gameState:', gameState);
        res.status(503);
        res.send(
          '503 Service Unavailable - Actual game state is: ' +
            gameState +
            '. While state needed by endpoint is: ' +
            neededState
        );
        return;
      }

      debug('compareStates:', gameState);
      next();
    }
  };
};
