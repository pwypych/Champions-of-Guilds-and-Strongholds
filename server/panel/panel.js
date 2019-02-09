// @format

'use strict';

const debug = require('debug')('cogs:panel');
const _ = require('lodash');

// What does this module do?
// Finds availiable maps and created games and generates html from it
module.exports = (environment, db, templateToHtml) => {
  return (req, res) => {
    (function init() {
      const viewModel = {};
      viewModel.baseurl = environment.baseurl;
      viewModel.timestamp = Date.now();
      viewModel._ = _;

      debug('init');
      findMapNames(viewModel);
    })();

    function findMapNames(viewModel) {
      const query = {};
      const options = {};
      options.projection = { _id: 1 };

      db.collection('mapCollection')
        .find(query, options)
        .toArray((error, mapArray) => {
          if (error) {
            debug('findMapNames: error:', error);
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

          debug('findMapNames', mapNameArray);
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
          sendResponce(viewModel);
        });
    }

    function sendResponce(viewModel) {
      templateToHtml(__filename, viewModel, (error, html) => {
        debug('sendResponce():html', html.length);
        debug('******************** send ********************');
        res.send(html);
      });
    }
  };
};
