// @format

'use strict';

const debug = require('debug')('cogs:generateParcelMap');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Generate random map based on parcels');
      const ctx = {};
      ctx.land = res.locals.land;

      forEachLandAbstractMapY(ctx);
    })();

    function forEachLandAbstractMapY(ctx) {
      const land = ctx.land;
      const parcelMap = [];
      ctx.parcelMap = parcelMap;

      land.abstractParcelMap.forEach((landRow, landY) => {
        ctx.landRow = landRow;
        ctx.landY = landY;
        if (!parcelMap[landY]) {
          parcelMap[landY] = [];
        }
        forEachLandX(ctx);
      });

      debug('forEachLandAbstractMapY: parcelMap.length:', parcelMap.length);
      debug(
        'forEachLandAbstractMapY: parcelMap[0].length:',
        parcelMap[0].length
      );
      land.parcelMap = parcelMap;
      next();
    }

    function forEachLandX(ctx) {
      const landRow = ctx.landRow;
      landRow.forEach((abstractParcel, landX) => {
        ctx.abstractParcel = abstractParcel;
        ctx.landX = landX;
        insertParcelbyAbstractParcel(ctx);
      });
    }

    function insertParcelbyAbstractParcel(ctx) {
      const parcelMap = ctx.parcelMap;
      const abstractParcelMap = ctx.land.abstractParcelMap;
      const landY = ctx.landY;
      const landX = ctx.landX;
      const parcelList = res.locals.parcelList;
      const parcelCategory = abstractParcelMap[landY][landX].category;

      parcelMap[landY][landX] = parcelList[parcelCategory][0];
      debug(
        'insertParcelbyAbstractParcel: parcelMap[landY][landX]:',
        parcelMap[landY][landX]
      );
    }
  };
};
