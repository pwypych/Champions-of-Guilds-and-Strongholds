// @format

'use strict';

const debug = require('debug')('cogs:generateParcelMap');
const _ = require('lodash');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Generate random pracelMap based on abstractParcelMap');

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
        transformParcelByExits(ctx);
      });
    }

    function transformParcelByExits(ctx) {
      const abstractParcel = ctx.abstractParcel;
      const category = abstractParcel.category;
      const exits = abstractParcel.exits;

      const parcelCategoryExitList = res.locals.parcelCategoryExitList;
      let parcel;

      // Parcels: ALL
      if (exits === 'oooo') {
        debug('transformParcelByExits: oooo:');
        parcel = toolSampleOneParcel(parcelCategoryExitList, category, 'all');
      }
      // Parcels: TOP-RIGHT-BOTTOM
      if (exits === 'ooox') {
        debug('transformParcelByExits: ooox:');
        parcel = toolSampleOneParcel(
          parcelCategoryExitList,
          category,
          'topRightBottom'
        );
      }

      if (exits === 'xooo') {
        debug('transformParcelByExits: xooo:');
        parcel = toolSampleOneParcel(
          parcelCategoryExitList,
          category,
          'topRightBottom'
        );

        parcel.parcelLayerWithStrings = toolRotate2DMatrixBy90(
          parcel.parcelLayerWithStrings
        );
      }

      if (exits === 'oxoo') {
        debug('transformParcelByExits: oxoo:');
        parcel = toolSampleOneParcel(
          parcelCategoryExitList,
          category,
          'topRightBottom'
        );

        parcel.parcelLayerWithStrings = toolRotate2DMatrixBy90(
          parcel.parcelLayerWithStrings
        );

        parcel.parcelLayerWithStrings = toolRotate2DMatrixBy90(
          parcel.parcelLayerWithStrings
        );
      }

      if (exits === 'ooxo') {
        debug('transformParcelByExits: ooxo:');
        parcel = toolSampleOneParcel(
          parcelCategoryExitList,
          category,
          'topRightBottom'
        );

        parcel.parcelLayerWithStrings = toolRotate2DMatrixBy90(
          parcel.parcelLayerWithStrings
        );

        parcel.parcelLayerWithStrings = toolRotate2DMatrixBy90(
          parcel.parcelLayerWithStrings
        );

        parcel.parcelLayerWithStrings = toolRotate2DMatrixBy90(
          parcel.parcelLayerWithStrings
        );
      }

      // Parcels: TOP-RIGHT
      if (exits === 'ooxx') {
        debug('transformParcelByExits: ooxx:');
        parcel = toolSampleOneParcel(
          parcelCategoryExitList,
          category,
          'topRight'
        );
      }

      if (exits === 'xoox') {
        debug('transformParcelByExits: xoox:');
        parcel = toolSampleOneParcel(
          parcelCategoryExitList,
          category,
          'topRight'
        );

        parcel.parcelLayerWithStrings = toolRotate2DMatrixBy90(
          parcel.parcelLayerWithStrings
        );
      }

      if (exits === 'xxoo') {
        debug('transformParcelByExits: xxoo:');
        parcel = toolSampleOneParcel(
          parcelCategoryExitList,
          category,
          'topRight'
        );

        parcel.parcelLayerWithStrings = toolRotate2DMatrixBy90(
          parcel.parcelLayerWithStrings
        );

        parcel.parcelLayerWithStrings = toolRotate2DMatrixBy90(
          parcel.parcelLayerWithStrings
        );
      }

      if (exits === 'oxxo') {
        debug('transformParcelByExits: oxxo:');
        parcel = toolSampleOneParcel(
          parcelCategoryExitList,
          category,
          'topRight'
        );

        parcel.parcelLayerWithStrings = toolRotate2DMatrixBy90(
          parcel.parcelLayerWithStrings
        );

        parcel.parcelLayerWithStrings = toolRotate2DMatrixBy90(
          parcel.parcelLayerWithStrings
        );

        parcel.parcelLayerWithStrings = toolRotate2DMatrixBy90(
          parcel.parcelLayerWithStrings
        );
      }

      // Parcels: TOP-BOTTOM
      if (exits === 'oxox') {
        debug('transformParcelByExits: oxox:');
        parcel = toolSampleOneParcel(
          parcelCategoryExitList,
          category,
          'topBottom'
        );
      }

      if (exits === 'xoxo') {
        debug('transformParcelByExits: xoxo:');
        parcel = toolSampleOneParcel(
          parcelCategoryExitList,
          category,
          'topBottom'
        );

        parcel.parcelLayerWithStrings = toolRotate2DMatrixBy90(
          parcel.parcelLayerWithStrings
        );
      }

      // Parcels: TOP
      if (exits === 'oxxx') {
        debug('transformParcelByExits: oxxx:');
        parcel = toolSampleOneParcel(parcelCategoryExitList, category, 'top');
      }

      if (exits === 'xoxx') {
        debug('transformParcelByExits: xoxx:');
        parcel = toolSampleOneParcel(parcelCategoryExitList, category, 'top');

        parcel.parcelLayerWithStrings = toolRotate2DMatrixBy90(
          parcel.parcelLayerWithStrings
        );
      }

      if (exits === 'xxox') {
        debug('transformParcelByExits: xxox:');
        parcel = toolSampleOneParcel(parcelCategoryExitList, category, 'top');

        parcel.parcelLayerWithStrings = toolRotate2DMatrixBy90(
          parcel.parcelLayerWithStrings
        );

        parcel.parcelLayerWithStrings = toolRotate2DMatrixBy90(
          parcel.parcelLayerWithStrings
        );
      }

      if (exits === 'xxxo') {
        debug('transformParcelByExits: xxxo:');
        parcel = toolSampleOneParcel(parcelCategoryExitList, category, 'top');

        parcel.parcelLayerWithStrings = toolRotate2DMatrixBy90(
          parcel.parcelLayerWithStrings
        );

        parcel.parcelLayerWithStrings = toolRotate2DMatrixBy90(
          parcel.parcelLayerWithStrings
        );

        parcel.parcelLayerWithStrings = toolRotate2DMatrixBy90(
          parcel.parcelLayerWithStrings
        );
      }

      ctx.parcel = parcel;
      insertRandomParcelbyAbstractParcel(ctx);
    }

    function insertRandomParcelbyAbstractParcel(ctx) {
      const parcel = ctx.parcel;
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

    function toolSampleOneParcel(parcelCategoryExitList, category, exit) {
      const parcelBlueprint = _.sample(parcelCategoryExitList[category][exit]);
      const parcel = JSON.parse(JSON.stringify(parcelBlueprint));
      return parcel;
    }
  };
};
