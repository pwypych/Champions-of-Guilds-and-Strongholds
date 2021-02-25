// @format

'use strict';

const debug = require('debug')('cogs:landEdit');
const _ = require('lodash');

module.exports = (environment, db, blueprint, templateToHtml) => {
  return (req, res) => {

    (function init() {
      debug(
        '// Loads land editor that allows to edit a land by landId'
      );

      const landId = req.query.landId;

      const viewModel = {};
      viewModel.baseurl = environment.baseurl;
      viewModel.landId = landId;

      findLandById(viewModel);
    })();

    function findLandById(viewModel) {
      const query = { _id: viewModel.landId };
      const options = {};

      db.collection('landCollection').findOne(
        query,
        options,
        (error, land) => {
          if (error) {
            debug('findLandById: error:', error);
            res.status(404).send('404 Not found - Read land error');
            return;
          }

          if (!land) {
            debug('land object is empty');
            res.status(404).send('404 Not found - Land not exist');
            return;
          }

          viewModel.land = land;
          debug('findLands', land._id);
          findAbstracts(viewModel);
        }
      );
    }

    function findAbstracts(viewModel) {
      // abstracts are like abstract figures, e.g. monster1
      const abstracts = [];

      _.forEach(blueprint.figure, (figure) => {
        if (figure.resource) {
          abstracts.push(figure.figureName);
        }
      });

      _.forEach(blueprint.figure, (figure) => {
        if (figure.visitableType) {
          abstracts.push(figure.figureName);
        }
      });

      // @todo special abstract list: monster1 etc.
      // @todo special abstract list: castleRandom

      viewModel.abstracts = abstracts;

      debug('findAbstracts', abstracts.length);
      sendResponse(viewModel);
    }

    function sendResponse(viewModel) {
      const path =
        environment.basepath + '/server/instrument/editorLand/landEdit.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        debug('sendResponse():html', html.length);
        debug('******************** send ********************');
        res.send(html);
      });
    }
  };
};
