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

      const matrix2D = [
        [1, 2, 3, 4, 5],
        [1, 2, 3, 4, 5],
        [1, 2, 3, 4, 5],
        [1, 2, 3, 4, 5],
        [1, 2, 3, 4, 5]
      ];

      debug('init: matrix2D:', matrix2D);

      const rotated90 = toolRotate2DMatrixBy90(matrix2D);
      debug('init: rotated90:', rotated90);

      const rotated180 = toolRotate2DMatrixBy90(rotated90);
      debug('init: rotated180:', rotated180);

      const ctx = {};
      ctx.land = res.locals.land;

      // forEachAbstractParcelMapY(ctx);
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
        transformParcelByExits(ctx);
      });
    }

    function transformParcelByExits(ctx) {
      insertRandomParcelbyAbstractParcel(ctx);
    }

    function insertRandomParcelbyAbstractParcel(ctx, parcel) {
      // const parcel = ctx.parcel;
      // debug(
      //   'insertRandomParcelbyAbstractParcel: parcel.parcelLayerWithStrings[2]:',
      //   parcel.parcelLayerWithStrings[2]
      // );
      const abstractParcel = ctx.abstractParcel;

      const parcelMap = ctx.parcelMap;
      const abstractParcelMapY = ctx.abstractParcelMapY;
      const abstractParcelMapX = ctx.abstractParcelMapX;

      parcel.level = abstractParcel.level;
      parcelMap[abstractParcelMapY][abstractParcelMapX] = parcel;
    }

    function toolRotate2DMatrixBy90(matrix) {
      const size = matrix[0].length;
      const newMatrix = JSON.parse(JSON.stringify(matrix));
      matrix.forEach((row, rowIndex) => {
        row.forEach((val, colIndex) => {
          const newRowIndex = colIndex;
          const newColIndex = size - 1 - rowIndex;
          newMatrix[newRowIndex][newColIndex] = val;
        });
      });
      return newMatrix;
    }
  };
};
