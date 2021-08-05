// @format

'use strict';

const debug = require('debug')('cogs:launchImmediately');
const _ = require('lodash');

module.exports = (environment, blueprint, templateToHtml) => {
  return (req, res) => {

    (function init() {
      debug(
        '// Loads map editor that allows to edit a map by mapId'
      );

      const mapId = req.query.mapId;

      const viewModel = {};
      viewModel.baseurl = environment.baseurl;
      viewModel.mapId = mapId;

      findRaces(viewModel);
    })();

    function findRaces(viewModel) {
      const races = [];

      _.forEach(blueprint.race, (object, race) => {
        races.push(race);
      });

      viewModel.races = races;

      debug('findRaces', races);
      sendResponse(viewModel);
    }

    function sendResponse(viewModel) {
      const path =
        environment.basepath + '/server/instrument/panel/launchImmediately.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        debug('sendResponse():html', html.length);
        debug('******************** send ********************');
        res.send(html);
      });
    }
  };
};
