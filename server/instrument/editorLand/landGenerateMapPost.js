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

      const surrounding = {};
      surrounding.parcelTop = getParcelTop(parcelArray, x, y);
      surrounding.parcelLeft = getParcelLeft(parcelArray, x, y);
      surrounding.parcelBottom = getParcelBottom(parcelArray, x, y);
      surrounding.parcelRight = getParcelRight(parcelArray, x, y);

      while (runInLoop) {
        let parcel = newParcel();

        parcel = addRequiredFiguresRandomly(abstractParcel, parcel);
        parcel = addRequiredCollidablesRandomly(abstractParcel, parcel);

        // more condition checks loop through, injected as middlewares
        // inject abstractParcel, surrounding parcels, parcelTop, parcelLeft, parcelBottom, parcelRight
        let areConditionsFullfilled = true;
        _.each(conditions, (condition) => {
          const isConditionFullfilled = condition(parcel, abstractParcel, surrounding);
          // debug('generateParcel: isConditionFullfilled:', isConditionFullfilled);
          if (!isConditionFullfilled) {
            areConditionsFullfilled = false;
            return false; // Break (lodash), no need to check more conditions if one fails
          }
          return true; // Continue (lodash)
        });

        if (areConditionsFullfilled) {
          runInLoop = false;
          parcelDone = parcel;
          debug('generateParcel: Conditions fullfilled for this parcel, done generating this parcel x: ' + x + ' y: ' + y);
        } else {
          debug('generateParcel: Conditions not fullfilled for this parcel, trying again x: ' + x + ' y: ' + y);
        }
      }

      debug('generateParcel: parcel: ', parcelDone);
      return parcelDone;
    }

    function getParcelTop(parcelArray, x, y) {
      if (y === 0) {
        debug('getParcelTop: []');
        return false;
      }

      const parcelTop = parcelArray[y - 1][x];
      debug('getParcelTop: y: ' + (y - 1) + ' x: ' + x);
      return parcelTop;
    }

    function getParcelLeft(parcelArray, x, y) {
      if (x === 0) {
        debug('getParcelLeft: []');
        return false;
      }

      const parcelLeft = parcelArray[y][x - 1];
      debug('getParcelLeft: y: ' + y + ' x: ' + (x - 1));
      return parcelLeft;
    }

    function getParcelBottom(parcelArray, x, y) {
      const height = parcelArray.length;

      if (y === height - 1) {
        debug('getParcelBottom: []');
        return false;
      }

      const parcelBottom = parcelArray[y + 1][x];
      debug('getParcelBottom: y: ' + (y + 1) + ' x: ' + x);
      return parcelBottom;
    }

    function getParcelRight(parcelArray, x, y) {
      const width = parcelArray[0].length;

      if (x === width - 1) {
        debug('getParcelRight: []');
        return false;
      }

      const parcelRight = parcelArray[y][x - 1];
      debug('getParcelRight: y: ' + y + ' x: ' + (x - 1));
      return parcelRight;
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

          if (condition.monster) {
            const [monsterX, monsterY] = pickNearEmptyCoords(parcel, x, y);

            debug('pickNearEmptyCoords: figure:' + condition.name + ' x: ' + monsterX + ' y: ' + monsterY);
            const monsterName = pickMonsterNameByLevel(abstractParcel.level);
            parcel[monsterY][monsterX] = monsterName;
          }
          // debug('addRequiredFiguresRandomly: figure:' + condition.name + ' x: ' + x + ' y: ' + y);
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

    function pickNearEmptyCoords(parcel, x, y) {
      const coordsArray = [];

      // assumes parcel is 7x7
      if (y - 1 > 0 && parcel[y - 1][x] === 'empty') {
        coordsArray.push([x, y - 1]);
      }

      if (y + 1 <= 6 && parcel[y + 1][x] === 'empty') {
        coordsArray.push([x, y + 1]);
      }

      if (x - 1 > 0 && parcel[y][x - 1] === 'empty') {
        coordsArray.push([x - 1, y]);
      }

      if (x + 1 <= 6  && parcel[y][x + 1] === 'empty') {
        coordsArray.push([x + 1, y]);
      }

      if (_.isEmpty(coordsArray)) {
        // if not possible to find coords nearby just place it randomly
        return pickRandomEmptyCoords(parcel);
      }

      return _.sample(coordsArray);
    }

    function pickMonsterNameByLevel(level) {
      const monsterNames = [];
      _.forEach(blueprint.unit, (unit) => {
        if (parseInt(level, 10) === unit.tier) {
          monsterNames.push(unit.unitName);
        }
      });

      return _.sample(monsterNames);
    }

    function addRequiredCollidablesRandomly(abstractParcel, parcel) {
      const count = _.random(10, 30);
      _.times(count, () => {
        const [x, y] = pickRandomEmptyCoords(parcel);
        parcel[y][x] = 'tree';
        // debug('addRequiredCollidablesRandomly: collidable: tree x: ' + x + ' y: ' + y);
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
