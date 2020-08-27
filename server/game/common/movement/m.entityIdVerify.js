// @format

'use strict';

const debug = require('debug')('cogs:entityIdVerify');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Verifies request.body, adds res.locals.entityId');
      const entities = res.locals.entities;

      verifyRequestBody(entities);
    })();

    function verifyRequestBody(entities) {
      const entityId = req.body.entityId;

      if (typeof entityId === 'undefined') {
        res.status(400);
        res.send({
          error: 'POST parameter error, entityId parameter not valid'
        });
        debug('POST parameter error, entityId parameter not valid');
        debug('******************** error ********************');
        return;
      }
      res.locals.entityId = entityId;

      debug('verifyRequestBody: entityId:', entityId);
      verifyEntityExists(entities, entityId);
    }

    function verifyEntityExists(entities, entityId) {
      if (!entities[entityId]) {
        res.status(400);
        res.send({
          error: 'entityId does not exist on server'
        });
        debug('entityId does not exist on server');
        debug('******************** error ********************');
        return;
      }

      next();
    }
  };
};
