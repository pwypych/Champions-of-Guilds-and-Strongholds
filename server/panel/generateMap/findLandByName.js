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
      const mapName = req.body.mapName;
      if (typeof mapName !== 'string') {
        debug('checkRequestBody: mapName not a string: ', req.body);
        res.status(503);
        res.send(
          '503 Service Unavailable - Wrong POST parameter or empty mapName parameter'
        );
        return;
      }

      debug('checkRequestBody');
      findMap(mapName);
    }

    function findMap(mapName) {
      const query = { name: mapName };
      const options = {};

      db.collection('landCollection').findOne(query, options, (error, land) => {
        if (error) {
          debug('findMap: error:', error);
          res.status(503).send('503 Service Unavailable - Cannot find map');
          return;
        }

        debug('findMap: land:', land);
        res.locals.land = land;

        next();
      });
    }
  };
};
