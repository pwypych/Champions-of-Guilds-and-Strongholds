// @format

'use strict';

const debug = require('debug')('cogs:panel');
const _ = require('lodash');

module.exports = (environment, db, templateToHtml) => {
  return (req, res) => {
    (function init() {
      debug(
        '// Finds availiable maps and created games and generates html from it'
      );

      const viewModel = {};
      viewModel.baseurl = environment.baseurl;
      viewModel.timestamp = Date.now();
      viewModel._ = _;

      findLandNames(viewModel);
    })();

    function findLandNames(viewModel) {
      const query = {};
      const options = {};
      options.projection = { _id: 1, name: 1 };

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
            debug('landObject:', landObject);
            return landObject.name;
          });

          viewModel.landNameArray = landNameArray;

          debug('findLandNames', landNameArray);
          findGames(viewModel);
        });
    }

    function findGames(viewModel) {
      const query = {};
      const options = {};

      db.collection('gameCollection')
        .find(query, options)
        .toArray((error, games) => {
          if (error) {
            debug('findGames: error:', error);
            res
              .status(503)
              .send(
                '503 Service Unavailable: Mongo error, cannot run find on gameCollection'
              );
            return;
          }

          viewModel.games = games;

          debug('findGames', games.length);
          findSaves(viewModel);
        });
    }

    function findSaves(viewModel) {
      const query = {};
      const options = {};

      db.collection('saveCollection')
        .find(query, options)
        .toArray((error, saves) => {
          if (error) {
            debug('findSaves: error:', error);
            res
              .status(503)
              .send(
                '503 Service Unavailable: Mongo error, cannot run find on saveCollection'
              );
            return;
          }

          viewModel.saves = saves;

          debug('findSaves', saves);
          sendResponse(viewModel);
        });
    }

    function sendResponse(viewModel) {
      const path =
        environment.basepath + '/server/instrument/panel/random/panelRandom.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        debug('sendResponse():html', html.length);
        debug('******************** send ********************');
        res.send(html);
      });
    }
  };
};
