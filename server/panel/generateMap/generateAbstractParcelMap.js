// @format

'use strict';

const debug = require('debug')('cogs:generateAbstractParcelMap');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Generate land object filled with abstractParcels');

      generateAbstractParcelMapArray();
    })();

    function generateAbstractParcelMapArray() {
      const land = res.locals.land;
      const abstractParcelMap = [];

      for (let y = 0; y < land.width; y += 1) {
        abstractParcelMap[y] = [];
        for (let x = 0; x < land.height; x += 1) {
          abstractParcelMap[y][x] = abstractParcelFactory(0);
        }
      }

      debug(
        'fillLandMapForTwoPlayersWithAbstractParcels: abstractParcelMap.length:',
        abstractParcelMap.length
      );
      debug(
        'fillLandMapForTwoPlayersWithAbstractParcels: abstractParcelMap[0][0]:',
        abstractParcelMap[0][0]
      );

      addCastleAbstractParcels(abstractParcelMap);
    }

    function addCastleAbstractParcels(abstractParcelMap) {
      const land = res.locals.land;
      abstractParcelMap[0][0].category = 'castle';
      abstractParcelMap[4][4].category = 'castle';

      debug(
        'addCastleAbstractParcels: abstractParcelMap[0][0]:',
        abstractParcelMap[0][0]
      );

      land.abstractParcelMap = abstractParcelMap;
      // next();
    }

    function abstractParcelFactory(level) {
      const abstractParcel = {};
      abstractParcel.category = 'treasure';
      abstractParcel.level = level;

      return abstractParcel;
    }
  };
};
