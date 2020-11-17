// @format

'use strict';

const debug = require('debug')('cogs:inspector');

module.exports = (environment, db, templateToHtml) => {
  return (req, res) => {

    (function init() {
      debug(
        '// Loads inspector that allows to inspect entities in database'
      );

      const gameId = req.query.gameId;

      const viewModel = {};
      viewModel.baseurl = environment.baseurl;

      findEntities(gameId, viewModel);
    })();

    function findEntities(gameId, viewModel) {
      const query = { _id: gameId };
      const options = {};

      db.collection('gameCollection').findOne(
        query,
        options,
        (error, entities) => {
          if (error) {
            debug('findGameById: error:', error);
            res.status(404).send('404 Not found - Read entities error');
            return;
          }

          if (!entities) {
            debug('entities object is empty');
            res.status(404).send('404 Not found - Game not exist');
            return;
          }

          viewModel.entities = entities;
          debug('findGameById', entities._id);
          sendResponse(viewModel);
        }
      );
    }

    function sendResponse(viewModel) {
      const path =
        environment.basepath + '/server/instrument/inspector/inspector.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        debug('sendResponse():html', html.length);
        debug('******************** send ********************');
        res.send(html);
      });
    }
  };
};
