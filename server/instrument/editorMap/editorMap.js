// @format

'use strict';

const debug = require('debug')('cogs:editorMap');

module.exports = (environment, db, templateToHtml) => {
  return (req, res) => {

    (function init() {
      debug(
        '// Loads map editor that allows to edit maps from predefinedMapCollection in database'
      );

      const viewModel = {};
      viewModel.baseurl = environment.baseurl;

      findMaps(viewModel);
    })();

    function findMaps(viewModel) {
      const query = {};
      const options = {};

      db.collection('predefinedMapCollection').findOne(
        query,
        options,
        (error, maps) => {
          if (error) {
            debug('findGameById: error:', error);
            res.status(404).send('404 Not found - Read maps error');
            return;
          }

          if (!maps) {
            debug('maps object is empty');
            res.status(404).send('404 Not found - Game not exist');
            return;
          }

          viewModel.maps = maps;
          debug('findMaps', maps._id);
          sendResponse(viewModel);
        }
      );
    }

    function sendResponse(viewModel) {
      const path =
        environment.basepath + '/server/instrument/editorMap/editorMap.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        debug('sendResponse():html', html.length);
        debug('******************** send ********************');
        res.send(html);
      });
    }
  };
};
