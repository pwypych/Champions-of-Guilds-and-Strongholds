// @format

'use strict';

const debug = require('debug')('cogs:landRandomizePost');
const mazeGeneration = require('maze-generation');
const _ = require('lodash');
const PF = require('pathfinding');

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
      generateCastles(landId, landLayer);
    }

    function generateCastles(landId, landLayer) {
      const accuracy = 1000;
      const playersCount = 3;
      let positionsCastle = [];
      let distanceLargest = 0;

      // loop 100 times
      _.times(accuracy, () => {
        const positionsTemporary = toolPickXRandomPositions(playersCount, landLayer);

        const distances = [];

        positionsTemporary.forEach((positionTemporary) => {
          const positionsRemaining = positionsTemporary.filter((position) => {
            return position !== positionTemporary;
          });

          positionsRemaining.forEach((positionRemaining) => {
            const path = toolFindPath(positionTemporary, positionRemaining, landLayer);
            const distance = path.length;
            distances.push(distance);
          });
        });

        // debug('distances', distances);
        const distanceMin = _.min(distances);

        // check how far they are from each other
        if (distanceMin > distanceLargest) {
          distanceLargest = distanceMin;
          positionsCastle = positionsTemporary;
        }
      });

      _.forEach(positionsCastle, (position) => {
        const condition = { name: 'castleRandom' };
        landLayer[position.y][position.x].conditions.push(condition);
      });

      debug('generateCastles', positionsCastle);
      generateLevels(positionsCastle, landId, landLayer);
    }

    function toolPickXRandomPositions(count, landLayer) {
      const height = landLayer.length;
      const width = landLayer[0].length;

      const positions = [];
      _.times(count, () => {
        let run = true;
        while (run) {
          const x = _.random(0, width - 1);
          const y = _.random(0, height - 1);
          if (!_.some(positions, {x: x, y: y})) { // _.includes does not work on objects
            run = false;
            positions.push({x: x, y: y});
          }
        }
      });

      return positions;
    }

    function generateLevels(positionsCastle, landId, landLayer) {
      // Calculate distances to nearest castles
      const nearestCastleArrayUnsorted = [];
      let amountParcel = 0;

      landLayer.forEach((row, y) => {
        row.forEach((parcel, x) => {
          amountParcel += 1;
          const distances = [];

          positionsCastle.forEach((positionCastle) => {
            const path = toolFindPath(positionCastle, {x: x, y: y}, landLayer);
            const distance = path.length;
            distances.push(distance);
          });

          const distance = _.min(distances);

          nearestCastleArrayUnsorted.push({x: x, y: y, distance: distance});
        });
      });

      const nearestCastleArray = _.sortBy(nearestCastleArrayUnsorted, ['distance']);


      const amountCastle = positionsCastle.length;

      // Fill level array with levels with algorithm:
      /*
        ex. 16 parcels and 3 castles
        16 - 3 castles = 13 free parcels
        13/5 ~= 2 parcels per level, rest is 3

        2 parcels + 1 = level 5
        2 parcels + 1 = level 4
        2 parcels + 1 = level 3
        2 parcels = level 2
        2 parcels = level 1
        3 castle parcels = level 1
      */
      const levelArray = [];
      _.times(amountCastle, () => {
        levelArray.push(1);
      });

      const amount = amountParcel - amountCastle;
      const average = Math.floor(amount / 5);
      const remaining = amount % 5;

      _.times(5, (i) => {
        _.times(average, () => {
          levelArray.push(i + 1);
        });
      });

      let subtractFromHardest = 0;
      _.times(remaining, () => {
        levelArray.push(5 - subtractFromHardest);
        subtractFromHardest += 1;
      });

      levelArray.sort(); // muntating

      // Assign levels with parcels sorted by distance to nearest castle
      levelArray.forEach((level, index) => {
        nearestCastleArray[index].level = level;
      });

      // Assign levels to landLayer
      nearestCastleArray.forEach((positionLevelObject) => {
        landLayer[positionLevelObject.y][positionLevelObject.x].level = positionLevelObject.level;
      });

      debug('generateLevels');
      generateRandomFigureOnEveryParcel(landId, landLayer);
    }

    function toolFindPath(positionFirst, positionSecond, landLayer) {
      const height = landLayer.length;
      const width = landLayer[0].length;

      const matrix = [];
      _.times(height * 3, () => {
        const row = [];
        _.times(width * 3, () => {
          row.push(1);
        });
        matrix.push(row);
      });

      landLayer.forEach((row, parcelY) => {
        row.forEach((parcel, parcelX) => {
          const matrixParcel = [
            [1, 1 , 1],
            [1, 0 , 1],
            [1, 1 , 1]
          ];

          parcel.conditions.forEach((condition) => {
            if (condition.name === 'exitTop') {
              matrixParcel[0][1] = 0;
            }

            if (condition.name === 'exitRight') {
              matrixParcel[1][2] = 0;
            }

            if (condition.name === 'exitBottom') {
              matrixParcel[2][1] = 0;
            }

            if (condition.name === 'exitLeft') {
              matrixParcel[1][0] = 0;
            }
          });

          // debug('toolFindPath: parcel x: ' + parcelX + ' y: ' + parcelY);

          const y = parcelY * 3;
          const x = parcelX * 3;

          matrix[y][x] = matrixParcel[0][0];
          matrix[y][x + 1] = matrixParcel[0][1];
          matrix[y][x + 2] = matrixParcel[0][2];
          matrix[y + 1][x] = matrixParcel[1][0];
          matrix[y + 1][x + 1] = matrixParcel[1][1];
          matrix[y + 1][x + 2] = matrixParcel[1][2];
          matrix[y + 2][x] = matrixParcel[2][0];
          matrix[y + 2][x + 1] = matrixParcel[2][1];
          matrix[y + 2][x + 2] = matrixParcel[2][2];
        });
      });

      // debug('toolFindPath: positionFirst', positionFirst);
      // debug('toolFindPath: positionSecond', positionSecond);

      const grid = new PF.Grid(matrix);

      const finder = new PF.AStarFinder({ allowDiagonal: false });
      const path = finder.findPath(
        positionFirst.x * 3 + 1,
        positionFirst.y * 3 + 1,
        positionSecond.x * 3 + 1,
        positionSecond.y * 3 + 1,
        grid
      );

      const pathTransformed = [];
      path.forEach((step) => {
        const x = step[0];
        const y = step[1];

        const xT = x - 1;
        const yT = y - 1;

        if ((xT % 3 === 0) && (yT % 3 === 0)) {
          const xR = xT / 3;
          const yR = yT / 3;

          const obj = {x: xR, y: yR};
          pathTransformed.push(obj);
        }
      });

      // debug('toolFindPath: path:', path);
      // debug('toolFindPath: pathTransformed', pathTransformed);
      return pathTransformed;
    }

    function generateRandomFigureOnEveryParcel(landId, landLayer) {
      _.forEach(landLayer, (row) => {
        _.forEach(row, (parcel) => {
          _.times(1, () => {
            if (_.random(1, 3) !== 1 ) {
              const figureName = toolPickRandomVisitable();
              let monster = false;
              if (_.random(1, 2) === 1 ) {
                monster = true;
              }
              const condition = { name: figureName, monster: monster };
              parcel.conditions.push(condition);
            }
          });

          _.times(1, () => {
            const figureName = toolPickRandomResource();
            let monster = false;
            if (_.random(1, 6) === 1 ) {
              monster = true;
            }
            const condition = { name: figureName, monster: monster };
            parcel.conditions.push(condition);
          });
        });
      });

      debug('generateRandomFigureOnEveryParcel');
      insertLand(landId, landLayer);
    }

    function toolPickRandomResource() {
      const resourceNames = [];
      _.forEach(blueprint.figure, (figure) => {
        if (figure.resource) {
          resourceNames.push(figure.figureName);
        }
      });
      return _.sample(resourceNames);
    }

    function toolPickRandomVisitable() {
      const visitableNames = [];
      _.forEach(blueprint.figure, (figure) => {
        if (figure.visitableType && figure.figureName !== 'castleRandom') {
          visitableNames.push(figure.figureName);
        }
      });
      return _.sample(visitableNames);
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
