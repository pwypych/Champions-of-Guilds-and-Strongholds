// @format

'use strict';

const debug = require('debug')('cogs:generateAbstractParcelMap');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Generate land object filled with abstractParcels');

      generateAbstractParcelMapWithLandSize();
    })();

    function generateAbstractParcelMapWithLandSize() {
      const land = res.locals.land;
      const abstractParcelMap = [];

      for (let y = 0; y < land.width; y += 1) {
        abstractParcelMap[y] = [];
        for (let x = 0; x < land.height; x += 1) {
          abstractParcelMap[y][x] = abstractParcelFactory(0);
        }
      }

      debug(
        'generateAbstractParcelMapWithLandSize: abstractParcelMap.length:',
        abstractParcelMap.length
      );
      debug(
        'generateAbstractParcelMapWithLandSize: abstractParcelMap.length:',
        abstractParcelMap[0].length
      );

      debug(
        'generateAbstractParcelMapWithLandSize: abstractParcelMap[0][0]:',
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
      debug('addCastleAbstractParcels: land:', land);
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
