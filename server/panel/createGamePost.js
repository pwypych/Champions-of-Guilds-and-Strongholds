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

        const mapObject = data;

        debug('findMap: mapObject._id:', mapObject._id);
        generateGameEntity(mapObject);
      });
    }

    function generateGameEntity(mapObject) {
      const entities = {};

      const id = 'game__' + shortid.generate();

      entities._id = id; // mongo id for that game is the same as entitie id for gameEntity

      entities[id] = {};
      entities[id].mapName = mapObject._id;
      entities[id].state = 'launchState';

      debug('generateGameEntity', entities[id]);
      calculatePlayerCount(mapObject, entities);
    }

    function calculatePlayerCount(mapObject, entities) {
      let playerCount = 0;
      mapObject.mapLayerWithStrings.forEach((row) => {
        row.forEach((tileName) => {
          if (tileName === 'castleRandom') {
            playerCount += 1;
          }
        });
      });

      debug('calculatePlayerCount: playerCount:', playerCount);
      generatePlayerEntities(mapObject, entities, playerCount);
    }

    function generatePlayerEntities(mapObject, entities, playerCount) {
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

      _.times(playerCount, (index) => {
        const id = 'player__' + shortid.generate();
        entities[id] = {};
        entities[id].playerToken = 'playerToken_' + shortid.generate();
        entities[id].playerData = {};
        entities[id].playerData.name = 'Player ' + (index + 1);
        entities[id].playerData.race = 'human';
        entities[id].playerData.color = colorArray[index];
        entities[id].playerData.readyForLaunch = 'no';
        debug('generatePlayerEntities: playerEntity:', entities[id]);
      });

      generateFigureEntities(mapObject, entities);
    }

    function generateFigureEntities(mapObject, entities) {
      const errorArray = [];

      mapObject.mapLayerWithStrings.forEach((row, y) => {
        row.forEach((figureName, x) => {
          if (figureName === 'empty') {
            return;
          }

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

          const entity = figureManagerTree[figureName].produce();

          // Add unique id to each figure instance
          const id = figureName + '_figure__' + shortid.generate();
          entity.position = { x: x, y: y };
          entity.existsInState = 'worldState';

          entities[id] = entity;
        });
      });

      if (!_.isEmpty(errorArray)) {
        debug('generateFigureEntities: errorArray:', errorArray);
        res
          .status(503)
          .send('503 Service Unavailable - ' + JSON.stringify(errorArray));
        return;
      }

      debug('generateFigureEntities');
      insertGame(entities);
    }

    function insertGame(entities) {
      db.collection('gameCollection').insertOne(entities, (error) => {
        if (error) {
          debug('insertGame: error:', error);
          res
            .status(503)
            .send('503 Service Unavailable - Cannot insert game instance');
        }

        debug('insertGame: _.size(entities):', _.size(entities));
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
