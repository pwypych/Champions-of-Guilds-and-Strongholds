// @format

'use strict';

const debug = require('debug')('cogs:createGameRandomPost');
const shortid = require('shortid');
const _ = require('lodash');

module.exports = (environment, db, figureBlueprint) => {
  return (req, res) => {
    (function init() {
      debug(
        '// Creates game in db based on map choosen by a player, sets starting properties'
      );

      const mapObject = res.locals.mapObject;

      generateGameEntity(mapObject);
    })();

    function generateGameEntity(mapObject) {
      const entities = {};

      const id = 'game__' + shortid.generate();

      entities._id = id; // mongo id for that game is the same as entitie id for gameEntity

      entities[id] = {};
      entities[id].mapData = {};
      // entities[id].mapData.name = mapObject._id;
      entities[id].mapData.name = 'random_map_2x2';
      entities[id].mapData.width = mapObject[0].length;
      entities[id].mapData.height = mapObject.length;

      entities[id].state = 'launchState';
      entities[id].day = 1;

      debug('generateGameEntity', entities[id]);
      calculatePlayerCount(mapObject, entities);
    }

    function calculatePlayerCount(mapObject, entities) {
      let playerCount = 0;
      mapObject.forEach((row) => {
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

      mapObject.forEach((row, y) => {
        row.forEach((figureName, x) => {
          // debug('generateFigureEntities: figureName:', figureName);
          if (figureName === 'empty') {
            return;
          }

          if (!figureBlueprint()[figureName]) {
            const error =
              'Cannot load figure that is required by the map: ' + figureName;
            errorArray.push(error);
            return;
          }

          const entity = figureBlueprint()[figureName];

          // Add unique id to each figure instance
          const id = figureName + '_figure__' + shortid.generate();
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
      // res.redirect('/panelRandom');
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
      res.redirect(environment.baseurl + '/panelRandom');
    }
  };
};
