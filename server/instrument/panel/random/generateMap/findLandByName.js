// @format

'use strict';

const debug = require('debug')('cogs:findLandByName');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('// Look for a land in landCollection by name choosen by player');

      checkRequestBody();
    })();

    function checkRequestBody() {
      const landName = req.body.landName;
      if (typeof landName !== 'string') {
        debug('checkRequestBody: landName not a string: ', req.body);
        res.status(503);
        res.send(
          '503 Service Unavailable - Wrong POST parameter or empty landName parameter'
        );
        return;
      }

      debug('checkRequestBody');
      findLand(landName);
    }

    function findLand(landName) {
      const query = { name: landName };
      const options = {};

      db.collection('landCollection').findOne(query, options, (error, land) => {
        if (error) {
          debug('findLand: error:', error);
          res.status(503).send('503 Service Unavailable - Cannot find map');
          return;
        }

        debug('findLand: land:', land);
        res.locals.land = land;

        next();
      });
    }
  };
};
