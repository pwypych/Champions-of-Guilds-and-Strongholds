// @format

'use strict';

const debug = require('debug')('cogs:readMap');

module.exports = (environment, db) => {
  return (req, res) => {
    const viewModel = {};
    viewModel.baseurl = environment.baseurl;
    viewModel.timestamp = Date.now();

    (function init() {
      debug('init');
      checkRequestQuery();
    })();

    function checkRequestQuery() {
      debug('req.query - ', req.query);
      res.send('api/readMap');
    }

    function findMap(mapName) {
      const query = { _id: mapName };
      const options = {};

      db.collection('mapCollection').findOne(
        query,
        options,
        (error, mapObject) => {
          if (error) {
            debug('findMap: error:', error);
            res.status(503).send('503 Error - Cannot find map');
            return;
          }

          debug('findMap', mapObject._id);
          prepareGameInstance(mapObject);
        }
      );
    }
  };
};
