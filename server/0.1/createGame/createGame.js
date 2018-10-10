// @format

'use strict';

const debug = require('debug')('cogs:createGame');

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

      db.collection('maps')
        .find(query, options)
        .toArray((error, mapArray) => {
          if (error) {
            debug('findMapNameArray: error:', error);
            res
              .status(503)
              .send('503 - Error - Cannot find anything in maps collection');
          }

          const mapNameArray = mapArray.map((mapObject) => {
            return mapObject._id;
          });

          viewModel.mapNameArray = mapNameArray;

          debug('findMapNameArray', mapNameArray);
          findActiveGames();
        });
    }

    function findActiveGames() {
      const query = {};
      const options = {};
      options.projection = { mapLayer: 0 };

      db.collection('games')
        .find(query, options)
        .toArray((error, gameInstanceArray) => {
          if (error) {
            debug('findActiveGames: error:', error);
            res
              .status(503)
              .send(
                '503 - Error - Cannot find activ games in games collection'
              );
          }

          const gameInstances = gameInstanceArray;

          viewModel.gameInstances = gameInstances;

          debug('findMapNameArray', gameInstances);
          sendResponce();
        });
    }

    function sendResponce() {
      templateToHtml(__filename, viewModel, (error, html) => {
        debug('sendResponce():html', viewModel, html);
        debug('******************** send ********************');
        res.send(html);
      });
    }
  };
};
