// @format

'use strict';

const debug = require('debug')('cogs:middlewareAjaxStateAuth');

module.exports = (neededState) => {
  return (req, res, next) => {
    const state = res.locals.game.state;

    (function init() {
      debug('init');
      compareStates();
    })();

    function compareStates() {
      if (state !== neededState) {
        // State is not the same
        debug('compareStates: invalid gameState:', state);
        res.status(503);
        res.send(
          '503 Service Unavailable - Actual game state is: ' +
            state +
            '. While state needed by endpoint is: ' +
            neededState
        );
        return;
      }

      debug('compareStates:', state);
      next();
    }
  };
};
