// @format

'use strict';

const debug = require('debug')('cogs:findLandByName');
const validator = require('validator');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug('// Look for a land in landCollection by name choosen by player');

      checkRequestBody();
    })();

    function checkRequestBody() {
      if (typeof req.body.mapName !== 'string') {
        debug('checkRequestBody: mapName not a string: ', req.body);
        res.status(503);
        res.send(
          '503 Service Unavailable - Wrong POST parameter or empty mapName parameter'
        );
        return;
      }

      debug('checkRequestBody');
      sanitizeRequestBody();
    }

    function sanitizeRequestBody() {
      const mapName = validator.whitelist(
        req.body.mapName,
        'abcdefghijklmnopqrstuvwxyz01234567890|_'
      );
      debug('checkRequestBody', mapName);
      findMap(mapName);
    }

    function findMap(mapName) {
      const query = { _id: mapName };
      const options = {};

      db.collection('mapCollection').findOne(query, options, (error, data) => {
        if (error) {
          debug('findMap: error:', error);
          res.status(503).send('503 Service Unavailable - Cannot find map');
          return;
        }

        const mapObject = data;

        debug('findMap: mapObject._id:', mapObject._id);
        next();
      });
    }
  };
};
