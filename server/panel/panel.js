// @format

'use strict';

const debug = require('debug')('cogs:panel');

// What does this module do?
// Finds availiable maps and created games and generates html from it
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
          findGameArray();
        });
    }

    function findGameArray() {
      const query = {};
      const options = {};
      options.projection = { mapLayer: 0 };

      db.collection('gameCollection')
        .find(query, options)
        .toArray((error, gameArray) => {
          if (error) {
            debug('findGameArray: error:', error);
            res
              .status(503)
              .send(
                '503 Service Unavailable: Mongo error, cannot run find on gameCollection'
              );
            return;
          }

          viewModel.gameArray = gameArray;

          debug('findMapNameArray', gameArray);
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
