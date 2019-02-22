// @format

'use strict';

const debug = require('debug')('cogs:pathSendResponse');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Sends response for journey result');
      const path = res.locals.path;

      sendResponse(path);
    })();

    function sendResponse(path) {
      debug('sendResponse: No Errors!');
      res.send({ error: 0, path: path });
      next();
    }
  };
};
