// @format

'use strict';

const debug = require('debug')('cogs:pathSendResponse');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Sends response for journey result');
      const unitPath = res.locals.unitPath;

      sendResponse(unitPath);
    })();

    function sendResponse(unitPath) {
      debug('sendResponse: No Errors!');
      res.send({ error: 0, unitPath: unitPath });
      next();
    }
  };
};
