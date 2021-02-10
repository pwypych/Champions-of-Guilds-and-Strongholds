// @format

'use strict';

const debug = require('debug')('cogs:editorMap');
const _ = require('lodash');

module.exports = (environment, db, blueprint, templateToHtml) => {
  return (req, res) => {

    (function init() {
      debug(
        '// Loads map editor that allows to edit a map by mapId'
      );

      const mapId = req.query.mapId;

      const viewModel = {};
      viewModel.baseurl = environment.baseurl;

      findMapById(mapId, viewModel);
    })();

    function findMapById(mapId, viewModel) {
      const query = { _id: mapId };
      const options = {};

      db.collection('predefinedMapCollection').findOne(
        query,
        options,
        (error, map) => {
          if (error) {
            debug('findMapById: error:', error);
            res.status(404).send('404 Not found - Read map error');
            return;
          }

          if (!map) {
            debug('map object is empty');
            res.status(404).send('404 Not found - Map not exist');
            return;
          }

          viewModel.map = map;
          debug('findMaps', map._id);
          findFigures(viewModel);
        }
      );
    }

    function findFigures(viewModel) {
      const figures = [];

      _.forEach(blueprint.figure, (figure) => {
        if (figure.collision) {
          figures.push(figure.figureName);
        }
      });

      _.forEach(blueprint.figure, (figure) => {
        if (figure.resource) {
          figures.push(figure.figureName);
        }
      });

      _.forEach(blueprint.figure, (figure) => {
        if (figure.visitableType) {
          figures.push(figure.figureName);
        }
      });

      _.forEach(blueprint.figure, (figure) => {
        if (figure.unitAmounts) {
          figures.push(figure.figureName);
        }
      });

      viewModel.figures = figures;

      debug('findFigures', figures.length);
      sendResponse(viewModel);
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
