// @format

'use strict';

const debug = require('debug')('cogs:maneuverPost');

// What does this module do?
// Endpoint, accepts wished unit journey for a unit, initial verifies, sends response and passes to next
module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('init');
      checkRequestBodyUnitId();
    })();

    function checkRequestBodyUnitId() {
      const unitId = req.body.unitId;

      if (typeof unitId === 'undefined') {
        res.status(400);
        res.send({ error: 'POST parameter error, unitId parameter not valid' });
        debug('******************** error ********************');
        return;
      }
      res.locals.unitId = unitId;

      debug('checkRequestBodyUnitId: unitId', unitId);
      sendResponce();
    }

    function sendResponce() {
      debug('sendResponce');
      res.send({ error: 0 });
      next();
    }
  };
};
