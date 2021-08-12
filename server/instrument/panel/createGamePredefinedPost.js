// @format

'use strict';

const debug = require('debug')('cogs:createGamePredefinedPost');
const shortId = require('shortid');
const validator = require('validator');
const _ = require('lodash');

module.exports = (environment, db, blueprint) => {
  return (req, res) => {
    let isAjax = false;

    (function init() {
      debug(
        '// Creates game in db based on map choosen by a player, sets starting properties'
      );

      validateRequestBody();
    })();

    function validateRequestBody() {
      if (typeof req.body.mapId !== 'string') {
        debug('validateRequestBody: mapId not a string: ', req.body);
        res.status(503);
        res.send(
          '503 Service Unavailable - Wrong POST parameter or empty mapId parameter'
        );
        return;
      }

      if (req.body.ajax) {
        isAjax = true;
      }

      debug('validateRequestBody');
      sanitizeRequestBody();
    }

    function sanitizeRequestBody() {
      const mapId = validator.whitelist(
        req.body.mapId,
        'abcdefghijklmnopqrstuvwxyz01234567890|_'
      );
      debug('validateRequestBody', mapId);
      findMap(mapId);
    }

    function findMap(mapId) {
      const query = { _id: mapId };
      const options = {};

      db.collection('mapCollection').findOne(
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

      const id = 'game__' + shortId.generate();

      entities._id = id; // mongo id for that game is the same as entitie id for gameEntity

      entities[id] = {};
      entities[id].mapData = {};
      entities[id].mapData.name = mapObject._id;
      entities[id].mapData.width = mapObject.mapLayer[0].length;
      entities[id].mapData.height = mapObject.mapLayer.length;

      entities[id].state = 'launchState';
      entities[id].day = 1;

      debug('generateGameEntity', entities[id]);
      calculatePlayerCount(mapObject, entities);
    }

    function calculatePlayerCount(mapObject, entities) {
      let playerCount = 0;
      mapObject.mapLayer.forEach((row) => {
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
        'pink',
        'yellow',
        'black',
        'grey',
        'white'
      ];

      _.times(playerCount, (index) => {
        const id = 'player__' + shortId.generate();
        entities[id] = {};
        entities[id].playerToken = 'playerToken_' + shortId.generate();
        entities[id].playerData = {};
        entities[id].playerData.name = 'Player ' + (index + 1);
        entities[id].playerData.race = 'beast';
        entities[id].playerData.color = colorArray[index];
        debug('generatePlayerEntities: playerEntity:', entities[id]);
      });

      generateFigureEntities(mapObject, entities);
    }

    function generateFigureEntities(mapObject, entities) {
      const errorArray = [];

      mapObject.mapLayer.forEach((row, y) => {
        row.forEach((figureName, x) => {
          debug('generateFigureEntities: figureName:', figureName);
          if (figureName === 'empty') {
            return;
          }

          const entity = JSON.parse(
            JSON.stringify(blueprint.figure[figureName])
          );

          // Add unique id to each figure instance
          const id = 'figure_' + figureName + '__' + shortId.generate();
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
        sendResponse(entities);
      });
    }

    function sendResponse(entities) {
      if (isAjax) {
        res.send({
          error: 0,
          entities: entities
        });
      } else {
        debug('sendResponse()');
        debug('******************** should redirect ********************');
        res.redirect(environment.baseurl + '/panelPredefined');
      }
    }
  };
};
