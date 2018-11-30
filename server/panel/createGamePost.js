// @format

'use strict';

const debug = require('debug')('cogs:createGamePost');
const shortid = require('shortid');
const validator = require('validator');
const _ = require('lodash');

// What does this module do?
// Creates game in db based on map choosen by a player, sets starting properties
module.exports = (environment, db, figureManagerTree) => {
  return (req, res) => {
    let mapObject;
    const game = {};

    (function init() {
      debug('init');
      checkRequestBody();
    })();

    function checkRequestBody() {
      if (typeof req.body.mapName !== 'string') {
        debug('checkRequestBody: mapName not a string: ', req.body);
        res.status(503);
        res.send(
          '503 Service Unavailable - Wrong POST parameter or empty mapName parameter'
        );
        return;
      }

      debug('checkRequestBody');
      sanitizeRequestBody();
    }

    function sanitizeRequestBody() {
      const mapName = validator.whitelist(
        req.body.mapName,
        'abcdefghijklmnopqrstuvwxyz01234567890|_'
      );
      debug('checkRequestBody', mapName);
      findMap(mapName);
    }

    function findMap(mapName) {
      const query = { _id: mapName };
      const options = {};

      db.collection('mapCollection').findOne(query, options, (error, data) => {
        if (error) {
          debug('findMap: error:', error);
          res.status(503).send('503 Service Unavailable - Cannot find map');
          return;
        }

        mapObject = data;

        debug('findMap: mapObject._id:', mapObject._id);
        generateGameProperties();
      });
    }

    function generateGameProperties() {
      game._id = shortid.generate();

      game.mapName = mapObject._id;

      game.state = 'launchState';

      // debug('game.mapLayer: %o', game.mapLayer);
      debug('generateGameProperties', game._id);
      getMapPlayersCount();
    }

    function getMapPlayersCount() {
      let playerCount = 0;
      mapObject.mapLayerWithStrings.forEach((row) => {
        row.forEach((tileName) => {
          if (tileName === 'castleRandom') {
            playerCount += 1;
          }
        });
      });

      game.playerCount = playerCount;

      debug('generateGameProperties: playerCount:', playerCount);
      generatePlayerArray();
    }

    function generatePlayerArray() {
      const colorArray = [
        'red',
        'blue',
        'green',
        'violet',
        'orange',
        'brown',
        'aqua',
        'pink'
      ];

      game.playerArray = _.times(game.playerCount, (index) => {
        const player = {};
        player.token = shortid.generate();
        player.name = 'Player ' + (index + 1);
        player.color = colorArray[index];
        player.ready = 'no';
        player.race = 'human';
        return player;
      });

      debug(
        'generatePlayerArray:game.playerArray.length',
        game.playerArray.length
      );
      instantiateFigures();
    }

    function instantiateFigures() {
      const errorArray = [];
      game.mapLayer = [];

      mapObject.mapLayerWithStrings.forEach((row, y) => {
        game.mapLayer[y] = [];
        row.forEach((figureName, x) => {
          if (!figureManagerTree[figureName]) {
            const error =
              'Cannot load figure that is required by the map: ' + figureName;
            errorArray.push(error);
            return;
          }

          if (!figureManagerTree[figureName].produce) {
            const error =
              'Cannot load blueprint for figure that is required by the map: ' +
              figureName;
            errorArray.push(error);
            return;
          }

          const figure = figureManagerTree[figureName].produce();

          // Add unique id to each figure instance
          figure._id = figureName + '_y' + y + '_x' + x;

          game.mapLayer[y][x] = figure;
        });
      });

      if (!_.isEmpty(errorArray)) {
        debug('instantiateFigures: errorArray:', errorArray);
        res
          .status(503)
          .send('503 Service Unavailable - ' + JSON.stringify(errorArray));
        return;
      }

      debug('instantiateFigures');
      insertGame();
    }

    function insertGame() {
      db.collection('gameCollection').insertOne(game, (error) => {
        if (error) {
          debug('insertGame: error:', error);
          res
            .status(503)
            .send('503 Service Unavailable - Cannot insert game instance');
        }

        debug('insertGame', game.mapName);
        sendResponce();
      });
    }

    function sendResponce() {
      debug('sendResponce()');
      debug('******************** should redirect ********************');
      res.redirect(environment.baseurl + '/panel');
    }
  };
};
