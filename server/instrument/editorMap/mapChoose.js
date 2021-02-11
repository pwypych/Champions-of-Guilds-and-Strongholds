// @format

'use strict';

const debug = require('debug')('cogs:mapChoose');

module.exports = (environment, db, templateToHtml) => {
  return (req, res) => {
    (function init() {
      debug(
        '// Finds availiable maps and creates a menu with map editor selection'
      );

      const viewModel = {};
      viewModel.baseurl = environment.baseurl;

      findMapNames(viewModel);
    })();

    function findMapNames(viewModel) {
      const query = {};
      const options = {};
      options.projection = { _id: 1 };

      db.collection('predefinedMapCollection')
        .find(query, options)
        .toArray((error, mapArray) => {
          if (error) {
            debug('findMapNames: error:', error);
            res
              .status(503)
              .send(
                '503 Service Unavailable: Mongo error, cannot run find on predefinedMapCollection'
              );
            return;
          }

          const mapNameArray = mapArray.map((mapObject) => {
            return mapObject._id;
          });

          viewModel.mapNameArray = mapNameArray;

          debug('findMapNames', mapNameArray);
          sendResponse(viewModel);
        });
    }

    function sendResponse(viewModel) {
      const path =
        environment.basepath + '/server/instrument/editorMap/mapChoose.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        debug('sendResponse():html', html.length);
        debug('******************** send ********************');
        res.send(html);
      });
    }
  };
};
