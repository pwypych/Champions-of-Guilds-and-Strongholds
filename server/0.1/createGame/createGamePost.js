// @format

'use strict';

const debug = require('debug')('cogs:createGamePost');

module.exports = (environment, sanitizer, db) => {
  return (req, res) => {
    const viewModel = {};
    viewModel.baseurl = environment.baseurl;

    let mapName;

    (function init() {
      debug('init');
      sanitizeMapName();
    })();

    function sanitizeMapName() {
      if (!req.body.mapName) {
        debug('sanitizeMapName: error: ', req.body);
        res.status(503).send('503 Error - Wrong POST parameter');
        return;
      }

      mapName = sanitizer.sanitizeMapName(req.body.mapName);
      debug('sanitizeMapName', mapName);
      findMap();
    }

    function findMap() {
      const query = { _id: mapName };
      const options = {};

      db.collection('maps').findOne(query, options, (error, mapObject) => {
        if (error) {
          debug('findMap: error:', error);
          res.status(503).send('503 Error - Cannot find map');
          return;
        }

        debug('findMap', mapObject);
        sendResponce(mapObject._id);
      });
    }

    function sendResponce(_id) {
      debug('sendResponce()');
      debug('******************** should redirect ********************');
      res.send('loaded map: ' + _id);
    }
  };
};
