// @format

'use strict';

const debug = require('debug')('cogs:createGamePost');

module.exports = (environment, db) => {
  return (req, res) => {
    const viewModel = {};
    viewModel.baseurl = environment.baseurl;

    (function init() {
      debug('init');
      findMap();
    })();

    // sanitize post

    function findMap() {
      const query = {};
      const options = {};

      db.collection('maps').findOne(query, options, (error, mapObject) => {
        if (error) {
          debug('findMap: error:', error);
          res.status(503).send('503 - Error - Cannot find map');
          return;
        }

        debug('findMap', mapObject);
        sendResponce();
      });
    }

    function sendResponce() {
      res.send('okey');
    }
  };
};
