// @format

'use strict';

const debug = require('debug')('cogs:createGamePost');
const shortid = require('shortid');

module.exports = (environment, sanitizer, db) => {
  return (req, res) => {
    const viewModel = {};
    viewModel.baseurl = environment.baseurl;

    let mapName;
    let gameInstance = {};

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
        convertMapObjectToGameInstanceMap(mapObject);
      });
    }

    function convertMapObjectToGameInstanceMap(mapObject) {
      gameInstance.mapName = mapObject._id;

      // mapObject.layers[0].data;
      // mapObject.width;
      const data = mapObject.layers[0].data;
      const height = mapObject.layers[0].height;
      const width = mapObject.layers[0].width;

      const mapLayer = [];

      for (let i = 0; i < height; i += 1) {
        mapLayer.push([]);
      }

      let x = 0;
      let y = 0;

      data.forEach((tileId) => {
        mapLayer[y].push(tileId);

        if (x >= width - 1) {
          y += 1;
          x = 0;
        } else {
          x += 1;
        }
      });

      debug('convertMapObjectToGameInstanceMap', mapLayer);
      sendResponce(mapObject._id);
    }

    function sendResponce(_id) {
      debug('sendResponce()');
      debug('******************** should redirect ********************');
      res.send('loaded map: ' + _id);
    }
  };
};
