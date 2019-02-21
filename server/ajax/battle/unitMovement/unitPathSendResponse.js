// @format

'use strict';

const debug = require('debug')('cogs:unitPathSendResponce');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Sends response for journey result, and updates recentManeuver');
      const unitPath = res.locals.unitPath;

      sendResponce(unitPath);
    })();

    function sendResponce(unitPath) {
      debug('sendResponce: No Errors!');
      res.send({ error: 0, unitPath: unitPath });
      next();
    }
  };
};
