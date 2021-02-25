// @format

'use strict';

const debug = require('debug')('cogs:landChoose');

module.exports = (environment, db, templateToHtml) => {
  return (req, res) => {
    (function init() {
      debug(
        '// Finds availiable lands and creates a menu with land editor selection'
      );

      const viewModel = {};
      viewModel.baseurl = environment.baseurl;

      findLandNames(viewModel);
    })();

    function findLandNames(viewModel) {
      const query = {};
      const options = {};
      options.projection = { _id: 1 };

      db.collection('landCollection')
        .find(query, options)
        .toArray((error, landArray) => {
          if (error) {
            debug('findLandNames: error:', error);
            res
              .status(503)
              .send(
                '503 Service Unavailable: Mongo error, cannot run find on landCollection'
              );
            return;
          }

          const landNameArray = landArray.map((landObject) => {
            return landObject._id;
          });

          viewModel.landNameArray = landNameArray;

          debug('findLandNames', landNameArray);
          sendResponse(viewModel);
        });
    }

    function sendResponse(viewModel) {
      const path =
        environment.basepath + '/server/instrument/editorLand/landChoose.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        debug('sendResponse():html', html.length);
        debug('******************** send ********************');
        res.send(html);
      });
    }
  };
};
