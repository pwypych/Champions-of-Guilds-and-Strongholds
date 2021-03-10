// @format

'use strict';

const debug = require('debug')('cogs:landGenerateMapPost');
const _ = require('lodash');

module.exports = (environment, blueprint, db) => {
  return (req, res) => {
    const conditions = res.locals.conditions;

    (function init() {
      debug('// Takes POST request with land to create a new random map');

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

        forEachAbstractParcel(land);
      });
    }

    function forEachAbstractParcel(land) {
      const height = land.landLayer.length;
      const width = land.landLayer[0].length;

      const parcelArray = [];
      _.times(height, () => {
        const row = [];
        _.times(width, () => {
          row.push([]);
        });
        parcelArray.push(row);
      });

      land.landLayer.forEach((row, y) => {
        row.forEach((abstractParcel, x) => {
          parcelArray[y][x] = generateParcel(parcelArray, x, y, abstractParcel);
        });
      });

      const mapLayer = parcelArrayToMapLayer(parcelArray);
      const mapId = 'random_map_1234';

      debug('forEachAbstractParcel');
      updateSetMapLayerWithStrings(mapId, mapLayer);
    }

    function updateSetMapLayerWithStrings(mapId, mapLayer) {
      const $set = {};
      $set.mapLayerWithStrings = mapLayer;

      const query = { _id: mapId };
      const update = { $set: $set };
      const options = { upsert: true };

      db.collection('predefinedMapCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateSetMapLayerWithStrings: error:', error);
          }

          sendResponse(mapId);
          debug('updateSetMapLayerWithStrings: Success!');
        }
      );
    }

    function parcelArrayToMapLayer(parcelArray) {
      const mapLayer = [];

      parcelArray.forEach((parcelArrayRow, parcelArrayY) => {
        parcelArrayRow.forEach((parcel, parcelArrayX) => {
          parcel.forEach((parcelRow, parcelY) => {
            const y = parcelY + 7 * parcelArrayY;
            if (!_.isArray(mapLayer[y])) {
              mapLayer[y] = [];
            }

            parcelRow.forEach((figureName, parcelX) => {
              const x = parcelX + 7 * parcelArrayX;
              mapLayer[y][x] = figureName;
            });
          });
        });
      });

      return mapLayer;
    }

    function generateParcel(parcelArray, x, y, abstractParcel) {
      let runInLoop = true;
      let parcelDone;

      const parcelTop = getParcelTop(parcelArray, x, y);
      const parcelLeft = getParcelLeft(parcelArray, x, y);

      while (runInLoop) {
        let parcel = newParcel();

        parcel = addRequiredFiguresRandomly(abstractParcel, parcel);
        parcel = addRequiredCollidablesRandomly(abstractParcel, parcel);

        // more condition checks loop through, injected as middlewares
        // inject parcel, parcelTop, parcelLeft, abstractParcel
        let areConditionsFullfilled = true;
        conditions.forEach((condition) => {
          const isConditionFullfilled = condition(parcel, abstractParcel, parcelTop, parcelLeft);
          // debug('generateParcel: isConditionFullfilled:', isConditionFullfilled);
          if (!isConditionFullfilled) {
            areConditionsFullfilled = false;
          }
        });

        if (areConditionsFullfilled) {
          runInLoop = false;
          parcelDone = parcel;
        }
        debug('generateParcel');
      }

      debug('generateParcel: parcel: ', parcelDone);
      return parcelDone;
    }

    function getParcelTop(parcelArray, x, y) {
      if (y === 0) {
        debug('getParcelTop: ', false);
        return false;
      }

      const parcelTop = parcelArray[y - 1][x];
      debug('getParcelTop: y: ' + (y - 1) + ' x: ' + x);
      return parcelTop;
    }

    function getParcelLeft(parcelArray, x, y) {
      if (x === 0) {
        debug('getParcelLeft: ', false);
        return false;
      }

      const parcelTop = parcelArray[y][x - 1];
      debug('getParcelLeft: y: ' + y + ' x: ' + (x - 1));
      return parcelTop;
    }

    function newParcel() {
      const parcel = [];
      _.times(7, () => {
        const row = [];
        _.times(7, () => {
          row.push('empty');
        });
        parcel.push(row);
      });

      return parcel;
    }

    function addRequiredFiguresRandomly(abstractParcel, parcel) {
      // add required figures randomly
      abstractParcel.conditions.forEach((condition) => {
        if (checkIsFigure(condition)) {
          const [x, y] = pickRandomEmptyCoords(parcel);
          parcel[y][x] = condition.name;
          debug('addRequiredFiguresRandomly: figure:' + condition.name + ' x: ' + x + ' y: ' + y);
        }
      });

      return parcel;
    }

    function checkIsFigure(condition) {
      let isFigure = false;
      _.forEach(blueprint.figure, (figure) => {
        if (condition.name === figure.figureName) {
          isFigure = true;
        }
      });

      return isFigure;
    }

    function addRequiredCollidablesRandomly(abstractParcel, parcel) {
      const count = _.random(15, 25);
      _.times(count, () => {
        const [x, y] = pickRandomEmptyCoords(parcel);
        parcel[y][x] = 'tree';
        debug('addRequiredCollidablesRandomly: collidable: tree x: ' + x + ' y: ' + y);
      });

      return parcel;
    }

    function pickRandomEmptyCoords(parcel) {
      let runInLoop = true;
      let y;
      let x;

      while (runInLoop) {
        y = _.random(0, 6);
        x = _.random(0, 6);

        if (parcel[y][x] === 'empty') {
          runInLoop = false;
        }
      }

      return [x, y];
    }

    function sendResponse(mapId) {
      debug('sendResponse()');
      debug('******************** ok ********************');
      res.redirect(environment.baseurl + '/editorMap/mapEdit?mapId=' + mapId);
    }
  };
};
