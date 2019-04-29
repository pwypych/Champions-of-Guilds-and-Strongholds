// @format

'use strict';

const debug = require('debug')('cogs:generateLand');
const _ = require('lodash');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Generate land object filled with abstractParcels');

      generateLand();
    })();

    function generateLand() {
      const land = {};
      land.name = 'nazwa';
      land.landMap = [];

      fillLandMapForTwoPlayersWithAbstractParcels(land);
    }

    function fillLandMapForTwoPlayersWithAbstractParcels(land) {
      land.landMap[0] = [
        abstractParcelFactory(0),
        abstractParcelFactory(1),
        abstractParcelFactory(2),
        abstractParcelFactory(3),
        abstractParcelFactory(4)
      ];
      land.landMap[1] = [
        abstractParcelFactory(1),
        abstractParcelFactory(2),
        abstractParcelFactory(3),
        abstractParcelFactory(4),
        abstractParcelFactory(5)
      ];
      land.landMap[2] = [
        abstractParcelFactory(2),
        abstractParcelFactory(3),
        abstractParcelFactory(4),
        abstractParcelFactory(3),
        abstractParcelFactory(2)
      ];
      land.landMap[3] = [
        abstractParcelFactory(3),
        abstractParcelFactory(4),
        abstractParcelFactory(3),
        abstractParcelFactory(2),
        abstractParcelFactory(1)
      ];
      land.landMap[4] = [
        abstractParcelFactory(4),
        abstractParcelFactory(3),
        abstractParcelFactory(2),
        abstractParcelFactory(1),
        abstractParcelFactory(0)
      ];

      debug(
        'fillLandMapForTwoPlayersWithAbstractParcels: land.landMap.length:',
        land.landMap.length
      );
      debug(
        'fillLandMapForTwoPlayersWithAbstractParcels: land.landMap[0][0]:',
        land.landMap[0][0]
      );

      addCastleAbstractParcels(land);
    }

    function addCastleAbstractParcels(land) {
      const parcelList = res.locals.parcelList;
      land.landMap[0][0] = parcelList.castle[0];
      land.landMap[4][4] = parcelList.castle[1];

      debug(
        'addCastleAbstractParcels: land.landMap[0][0]:',
        land.landMap[0][0]
      );

      res.locals.land = land;
      next();
    }

    function abstractParcelFactory(level) {
      const parcelList = res.locals.parcelList;
      const treasureParcelCount = parcelList.treasure.length - 1;

      const abstractParcel = {};
      abstractParcel.category = 'treasure';
      abstractParcel.level = level;
      abstractParcel.parcelMap =
        parcelList.treasure[_.random(0, treasureParcelCount)];

      return abstractParcel;
    }
  };
};
