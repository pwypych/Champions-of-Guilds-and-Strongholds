// @format

'use strict';

const debug = require('debug')('cogs:generateLand');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Generate land object filled with abstractParcels');

      generateLand();
    })();

    function generateLand() {
      const land = {};
      land.name = 'nazwa';
      land.abstractParcelMap = [];

      fillLandMapForTwoPlayersWithAbstractParcels(land);
    }

    function fillLandMapForTwoPlayersWithAbstractParcels(land) {
      land.abstractParcelMap[0] = [
        abstractParcelFactory(0),
        abstractParcelFactory(1),
        abstractParcelFactory(2),
        abstractParcelFactory(3),
        abstractParcelFactory(4)
      ];
      land.abstractParcelMap[1] = [
        abstractParcelFactory(1),
        abstractParcelFactory(2),
        abstractParcelFactory(3),
        abstractParcelFactory(4),
        abstractParcelFactory(5)
      ];
      land.abstractParcelMap[2] = [
        abstractParcelFactory(2),
        abstractParcelFactory(3),
        abstractParcelFactory(4),
        abstractParcelFactory(3),
        abstractParcelFactory(2)
      ];
      land.abstractParcelMap[3] = [
        abstractParcelFactory(3),
        abstractParcelFactory(4),
        abstractParcelFactory(3),
        abstractParcelFactory(2),
        abstractParcelFactory(1)
      ];
      land.abstractParcelMap[4] = [
        abstractParcelFactory(4),
        abstractParcelFactory(3),
        abstractParcelFactory(2),
        abstractParcelFactory(1),
        abstractParcelFactory(0)
      ];

      debug(
        'fillLandMapForTwoPlayersWithAbstractParcels: land.abstractParcelMap.length:',
        land.abstractParcelMap.length
      );
      debug(
        'fillLandMapForTwoPlayersWithAbstractParcels: land.abstractParcelMap[0][0]:',
        land.abstractParcelMap[0][0]
      );

      addCastleAbstractParcels(land);
    }

    function addCastleAbstractParcels(land) {
      land.abstractParcelMap[0][0].category = 'castle';
      land.abstractParcelMap[4][4].category = 'castle';

      debug(
        'addCastleAbstractParcels: land.abstractParcelMap[0][0]:',
        land.abstractParcelMap[0][0]
      );

      res.locals.land = land;
      next();
    }

    function abstractParcelFactory(level) {
      const abstractParcel = {};
      abstractParcel.category = 'treasure';
      abstractParcel.level = level;

      return abstractParcel;
    }
  };
};
