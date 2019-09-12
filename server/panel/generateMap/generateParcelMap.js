// @format

'use strict';

const debug = require('debug')('cogs:generateParcelMap');
const _ = require('lodash');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Generate random pracelMap based on abstractParcels from abstractParcelMap'
      );
      const ctx = {};
      ctx.land = res.locals.land;

      forEachAbstractParcelMapY(ctx);
    })();

    function forEachAbstractParcelMapY(ctx) {
      const land = ctx.land;
      const abstractParcelMap = land.abstractParcelMap;
      const parcelMap = [];
      ctx.parcelMap = parcelMap;

      abstractParcelMap.forEach((abstractParcelMapRow, abstractParcelMapY) => {
        ctx.abstractParcelMapRow = abstractParcelMapRow;
        ctx.abstractParcelMapY = abstractParcelMapY;
        if (!parcelMap[abstractParcelMapY]) {
          parcelMap[abstractParcelMapY] = [];
        }

        forEachAbstractParcelMapX(ctx);
      });

      debug('forEachAbstractParcelMapY: parcelMap.length:', parcelMap.length);
      debug(
        'forEachAbstractParcelMapY: parcelMap[0].length:',
        parcelMap[0].length
      );
      land.parcelMap = parcelMap;
      next();
    }

    function forEachAbstractParcelMapX(ctx) {
      const abstractParcelMapRow = ctx.abstractParcelMapRow;
      abstractParcelMapRow.forEach((abstractParcel, abstractParcelMapX) => {
        ctx.abstractParcel = abstractParcel;
        ctx.abstractParcelMapX = abstractParcelMapX;
        insertRandomParcelbyAbstractParcel(ctx);
      });
    }

    function insertRandomParcelbyAbstractParcel(ctx) {
      const parcelMap = ctx.parcelMap;
      const abstractParcelMap = ctx.land.abstractParcelMap;
      const abstractParcelMapY = ctx.abstractParcelMapY;
      const abstractParcelMapX = ctx.abstractParcelMapX;
      const parcelList = res.locals.parcelList;

      const abstractParcel =
        abstractParcelMap[abstractParcelMapY][abstractParcelMapX];

      debug('abstractParcel.category:', abstractParcel.category);
      debug('abstractParcel.exits:', abstractParcel.exits);

      const categoryOfParcelsAmount =
        parcelList[abstractParcel.category][abstractParcel.exits].length;
      debug(
        'insertRandomParcelbyAbstractParcel: categoryOfParcelsAmount:',
        categoryOfParcelsAmount
      );

      const randomParcelIndex = _.random(0, categoryOfParcelsAmount - 1);

      const randomParcel =
        parcelList[abstractParcel.category][abstractParcel.exits][
          randomParcelIndex
        ];

      randomParcel.level = abstractParcel.level;
      parcelMap[abstractParcelMapY][abstractParcelMapX] = randomParcel;
    }
  };
};
