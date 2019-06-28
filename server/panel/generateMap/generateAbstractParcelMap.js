// @format

'use strict';

const debug = require('debug')('cogs:generateAbstractParcelMap');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Generate abstractParcelMap that is two dimensional array filled with abstractParcels'
      );

      generateAbstractParcelMapWithLandSize();
    })();

    function generateAbstractParcelMapWithLandSize() {
      const land = res.locals.land;
      const landLevelMap = land.levelMap;
      const mazeMap = land.mazeMap;
      const abstractParcelMap = [];

      for (let y = 0; y < land.levelMap.length; y += 1) {
        abstractParcelMap[y] = [];
        for (let x = 0; x < land.levelMap[0].length; x += 1) {
          abstractParcelMap[y][x] = abstractParcelFactory(
            landLevelMap[y][x],
            mazeMap[y][x]
          );
          debug(
            'generateAbstractParcelMapWithLandSize: abstractParcelMap[y][x]:',
            abstractParcelMap[y][x]
          );
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

      land.abstractParcelMap = abstractParcelMap;
      next();
    }

    function abstractParcelFactory(level, exits) {
      const abstractParcel = {};
      abstractParcel.category = 'treasure';
      if (level === 0) {
        abstractParcel.category = 'castle';
      }
      abstractParcel.level = level;
      abstractParcel.exits = exits;

      return abstractParcel;
    }
  };
};
