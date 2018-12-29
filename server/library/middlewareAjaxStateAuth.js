// @format

'use strict';

const debug = require('debug')('nope:cogs:middlewareAjaxStateAuth');

// What does this module do?
// Middleware that checks if game is in given state and stops if not
module.exports = (neededState) => {
  return (req, res, next) => {
    (function init() {
      debug('init');
      compareStates();
    })();

    function compareStates() {
      const gameId = res.locals.entities._id;
      const state = res.locals.entities[gameId].state;

      if (state !== neededState) {
        let message = '';
        message += 'Actual game state is: ';
        message += state;
        message += '. While state needed by endpoint is: ';
        message += neededState;

        debug('compareStates:', message);
        res.status(503);
        res.send('503 Service Unavailable - ' + message);
        return;
      }

      debug('compareStates: Auth passed! state:', state);
      next();
    }
  };
};
