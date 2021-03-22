// @format

'use strict';

const debug = require('debug')('cogs:landRandomizePost');
const mazeGeneration = require('maze-generation');
const _ = require('lodash');

module.exports = (environment, blueprint, db) => {
  return (req, res) => {
    (function init() {
      debug(
        '// Takes POST request with land to fill it with random abstract parcels (maze, figures etc)'
      );

      validateRequestBody();
    })();

    function validateRequestBody() {
      if (!req.body.landId) {
        debug('vaidateRequestBody: error: ', req.body);
        res.status(503).send('Map Name cannot be empty');
        return;
      }

      const landId = req.body.landId;

      debug('validateRequestBody: landId:', landId);
      findLand(landId);
    }

    function findLand(landId) {
      const query = { _id: landId };
      const options = {};

      db.collection('landCollection').findOne(query, options, (error, land) => {
        if (error) {
          debug('findLand: error:', error);
          res.status(503).send('503 Service Unavailable - Cannot find land');
          return;
        }

        debug('findLand: land:', land);

        calculateWidthHeight(landId, land);
      });
    }

    function calculateWidthHeight(landId, land) {
      const height = land.landLayer.length;
      const width = land.landLayer[0].length;

      debug('calculateWidthHeight', height, width);
      generateLand(landId, width, height);
    }

    function generateLand(landId, width, height) {
      const landLayer = [];

      _.times(height, () => {
        const row = [];
        _.times(width, () => {
          row.push({
            level: 1,
            conditions: []
          });
        });
        landLayer.push(row);
      });

      generateMaze(landId, landLayer, width, height);
    }

    function generateMaze(landId, landLayer, width, height) {
      const maze = mazeGeneration(width, height);
      const mazeMatrix = maze.toJSON().rows;
      const mazeString = maze.toString();

      _.forEach(mazeMatrix, (row, y) => {
        _.forEach(row, (walls, x) => {
          if (walls.up === false) {
            const condition = { name: 'exitTop' };
            landLayer[y][x].conditions.push(condition);
          }
          if (walls.right === false) {
            const condition = { name: 'exitRight' };
            landLayer[y][x].conditions.push(condition);
          }
          if (walls.down === false) {
            const condition = { name: 'exitBottom' };
            landLayer[y][x].conditions.push(condition);
          }
          if (walls.left === false) {
            const condition = { name: 'exitLeft' };
            landLayer[y][x].conditions.push(condition);
          }
        });
      });

      debug('generateMaze', mazeMatrix);
      debug(mazeString);
      insertLand(landId, landLayer);
    }

    function insertLand(landId, landLayer) {
      const query = { _id: landId };
      const update = { $set: { landLayer: landLayer } };
      const options = {};

      db.collection('landCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('insertGame: error:', error);
            res
              .status(503)
              .send('503 Service Unavailable - Cannot insert land instance');
          }

          debug('insertLand: landId:', landId);
          sendResponse(landId);
        }
      );
    }

    function sendResponse(landId) {
      debug('sendResponse()');
      debug('******************** ok ********************');
      res.redirect(
        environment.baseurl + '/editorLand/landEdit?landId=' + landId
      );
    }
  };
};
