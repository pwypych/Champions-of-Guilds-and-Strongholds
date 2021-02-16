// @format

'use strict';

const debug = require('debug')('cogs:mapEdit');

module.exports = (environment, templateToHtml) => {
  return (req, res) => {

    (function init() {
      debug(
        '// Loads map editor that allows to edit a map by mapId'
      );

      const mapId = req.query.mapId;

      const viewModel = {};
      viewModel.baseurl = environment.baseurl;
      viewModel.mapId = mapId;

      sendResponse(viewModel);
    })();

    function sendResponse(viewModel) {
      const path =
        environment.basepath + '/server/instrument/panel/predefined/launchImmediately.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        debug('sendResponse():html', html.length);
        debug('******************** send ********************');
        res.send(html);
      });
    }
  };
};
