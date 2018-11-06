// @format

'use strict';

const debug = require('debug')('cogs:gamePanel');

module.exports = (environment, db, templateToHtml) => {
  return (req, res) => {
    const viewModel = {};
    viewModel.baseurl = environment.baseurl;
    viewModel.timestamp = Date.now();

    (function init() {
      debug('init');
      findMapNameArray();
    })();

    function findMapNameArray() {
      const query = {};
      const options = {};
      options.projection = { _id: 1 };

      db.collection('mapCollection')
        .find(query, options)
        .toArray((error, mapArray) => {
          if (error) {
            debug('findMapNameArray: error:', error);
            res
              .status(503)
              .send(
                '503 Service Unavailable: Mongo error, cannot run find on mapCollection'
              );
            return;
          }

          const mapNameArray = mapArray.map((mapObject) => {
            return mapObject._id;
          });

          viewModel.mapNameArray = mapNameArray;

          debug('findMapNameArray', mapNameArray);
          findGameInstanceArray();
        });
    }

    function findGameInstanceArray() {
      const query = {};
      const options = {};
      options.projection = { mapLayer: 0 };

      db.collection('gameInstanceCollection')
        .find(query, options)
        .toArray((error, gameInstanceArray) => {
          if (error) {
            debug('findGameInstanceArray: error:', error);
            res
              .status(503)
              .send(
                '503 Service Unavailable: Mongo error, cannot run find on gameInstanceCollection'
              );
            return;
          }

          viewModel.gameInstanceArray = gameInstanceArray;

          debug('findMapNameArray', gameInstanceArray);
          sendResponce();
        });
    }

    function sendResponce() {
      templateToHtml(__filename, viewModel, (error, html) => {
        debug('sendResponce():html', viewModel, html.length);
        debug('******************** send ********************');
        res.send(html);
      });
    }
  };
};
