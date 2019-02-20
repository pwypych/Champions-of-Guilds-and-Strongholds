// @format

'use strict';

const debug = require('debug')('cogs:maneuverSendResponse');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Endpoint, sends response for maneuver');

      sendResponce();
    })();

    function sendResponce() {
      debug('sendResponce: No Errors!');
      res.send({ error: 0 });
      next();
    }
  };
};
