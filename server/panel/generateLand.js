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
      land.abstractMap = [];

      fillLandMapForTwoPlayersWithAbstractParcels(land);
    }

    function fillLandMapForTwoPlayersWithAbstractParcels(land) {
      land.abstractMap[0] = [
        abstractParcelFactory(0),
        abstractParcelFactory(1),
        abstractParcelFactory(2),
        abstractParcelFactory(3),
        abstractParcelFactory(4)
      ];
      land.abstractMap[1] = [
        abstractParcelFactory(1),
        abstractParcelFactory(2),
        abstractParcelFactory(3),
        abstractParcelFactory(4),
        abstractParcelFactory(5)
      ];
      land.abstractMap[2] = [
        abstractParcelFactory(2),
        abstractParcelFactory(3),
        abstractParcelFactory(4),
        abstractParcelFactory(3),
        abstractParcelFactory(2)
      ];
      land.abstractMap[3] = [
        abstractParcelFactory(3),
        abstractParcelFactory(4),
        abstractParcelFactory(3),
        abstractParcelFactory(2),
        abstractParcelFactory(1)
      ];
      land.abstractMap[4] = [
        abstractParcelFactory(4),
        abstractParcelFactory(3),
        abstractParcelFactory(2),
        abstractParcelFactory(1),
        abstractParcelFactory(0)
      ];

      debug(
        'fillLandMapForTwoPlayersWithAbstractParcels: land.abstractMap.length:',
        land.abstractMap.length
      );
      debug(
        'fillLandMapForTwoPlayersWithAbstractParcels: land.abstractMap[0][0]:',
        land.abstractMap[0][0]
      );

      addCastleAbstractParcels(land);
    }

    function addCastleAbstractParcels(land) {
      land.abstractMap[0][0].category = 'castle';
      land.abstractMap[4][4].category = 'castle';

      debug(
        'addCastleAbstractParcels: land.abstractMap[0][0]:',
        land.abstractMap[0][0]
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
