// @format

'use strict';

const debug = require('debug')('cogs:maneuverWait');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Use rest of unit maneuver to skip its turn');

      setManeuverEndingTurn();
    })();

    function setManeuverEndingTurn() {
      res.locals.isManeuverEndingTurn = true;
      next();
    }
  };
};
