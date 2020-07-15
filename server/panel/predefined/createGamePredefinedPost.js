// @format

'use strict';

const debug = require('debug')('cogs:createGamePredefinedPost');
const shortid = require('shortid');
const validator = require('validator');
const _ = require('lodash');

module.exports = (environment, db, hook) => {
  return (req, res) => {
    (function init() {
      debug(
        '// Creates game in db based on map choosen by a player, sets starting properties'
      );

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

      db.collection('predefinedMapCollection').findOne(
        query,
        options,
        (error, data) => {
          if (error) {
            debug('findMap: error:', error);
            res.status(503).send('503 Service Unavailable - Cannot find map');
            return;
          }

          const mapObject = data;

          debug('findMap: mapObject._id:', mapObject._id);
          generateGameEntity(mapObject);
        }
      );
    }

    function generateGameEntity(mapObject) {
      const entities = {};

      const id = 'game__' + shortid.generate();

      entities._id = id; // mongo id for that game is the same as entitie id for gameEntity

      entities[id] = {};
      entities[id].mapData = {};
      entities[id].mapData.name = mapObject._id;
      entities[id].mapData.width = mapObject.mapLayerWithStrings[0].length;
      entities[id].mapData.height = mapObject.mapLayerWithStrings.length;

      entities[id].state = 'launchState';
      entities[id].day = 1;

      debug('generateGameEntity', entities[id]);
      generateBlueprints(mapObject, entities);
    }

    function generateBlueprints(mapObject, entities) {
      const ctx = { entities: entities, db: db };
      hook.run('generateBlueprints_', ctx, (error) => {
        // hook mutates ctx
        debug('generateBlueprints');
        calculatePlayerCount(mapObject, entities);
      });
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
        debug('generatePlayerEntities: playerEntity:', entities[id]);
      });

      generateFigureEntities(mapObject, entities);
    }

    function generateFigureEntities(mapObject, entities) {
      const errorArray = [];

      mapObject.mapLayerWithStrings.forEach((row, y) => {
        row.forEach((figureName, x) => {
          debug('generateFigureEntities: figureName:', figureName);
          if (figureName === 'empty') {
            return;
          }

          // Find figure blueprint
          let blueprint;
          _.forEach(entities, (entity) => {
            if (entity.blueprintType && figureName === entity.figureName) {
              blueprint = entity;
            }
          });

          if (!blueprint) {
            const error =
              'Cannot load figure that is required by the map: ' + figureName;
            errorArray.push(error);
            return;
          }

          const entity = JSON.parse(JSON.stringify(blueprint));

          // Add unique id to each figure instance
          const id = 'figure_' + figureName + '__' + shortid.generate();
          entity.figureName = figureName;
          entity.position = { x: x, y: y };

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
        sendResponse();
      });
    }

    function sendResponse() {
      debug('sendResponse()');
      debug('******************** should redirect ********************');
      res.redirect(environment.baseurl + '/panelPredefined');
    }
  };
};
