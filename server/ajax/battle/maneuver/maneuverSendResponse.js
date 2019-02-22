// @format

'use strict';

const debug = require('debug')('cogs:maneuverSendResponse');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Endpoint, sends response for maneuver');

      sendResponse();
    })();

    function sendResponse() {
      debug('sendResponse: No Errors!');
      res.send({ error: 0 });
      next();
    }
  };
};
