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

      landLevelMap.forEach((levelMapRow, levelMapY) => {
        abstractParcelMap[levelMapY] = [];
        levelMapRow.forEach((mapLevel, levelMapX) => {
          abstractParcelMap[levelMapY][levelMapX] = abstractParcelFactory(
            landLevelMap[levelMapY][levelMapX],
            mazeMap[levelMapY][levelMapX]
          );
          debug(
            'generateAbstractParcelMapWithLandSize: abstractParcelMap[y][x]:',
            abstractParcelMap[levelMapY][levelMapX]
          );
        });
      });

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
