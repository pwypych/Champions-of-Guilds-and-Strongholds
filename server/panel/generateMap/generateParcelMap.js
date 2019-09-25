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

      const matrix = [[1, 2, 3], [1, 2, 3], [1, 2, 3]];
      debug('init: Before unzip matrix:', matrix);
      _.unzip(matrix);
      debug('init: After unzip matrix:', _.unzip(matrix));

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
      const abstractParcelExits = ctx.abstractParcel.exits;
      const parcelList = res.locals.parcelList;
      let parcel;

      debug('abstractParcelExits:', abstractParcelExits);
      // Parcels ALL
      if (abstractParcelExits === 'oooo') {
        const categoryOfParcelsAmount =
          parcelList[abstractParcel.category].all.length;
        const randomParcelIndex = _.random(0, categoryOfParcelsAmount - 1);
        parcel = parcelList[abstractParcel.category].all[randomParcelIndex];
        debug('forEachAbstractParcelMapY: parcel:', parcel);
      }

      // Parcels TOP-RIGHT-BOTTOM
      if (abstractParcelExits === 'xooo') {
        const categoryOfParcelsAmount =
          parcelList[abstractParcel.category].topRightBottom.length;
        const randomParcelIndex = _.random(0, categoryOfParcelsAmount - 1);
        parcel =
          parcelList[abstractParcel.category].topRightBottom[randomParcelIndex];
        parcel.parcelLayerWithStrings = _.unzip(parcel.parcelLayerWithStrings);
      }

      if (abstractParcelExits === 'oxoo') {
        const categoryOfParcelsAmount =
          parcelList[abstractParcel.category].topRightBottom.length;
        const randomParcelIndex = _.random(0, categoryOfParcelsAmount - 1);
        parcel =
          parcelList[abstractParcel.category].topRightBottom[randomParcelIndex];
        parcel.parcelLayerWithStrings = _.unzip(parcel.parcelLayerWithStrings);
        parcel.parcelLayerWithStrings = _.unzip(parcel.parcelLayerWithStrings);
      }

      if (abstractParcelExits === 'ooxo') {
        const categoryOfParcelsAmount =
          parcelList[abstractParcel.category].topRightBottom.length;
        const randomParcelIndex = _.random(0, categoryOfParcelsAmount - 1);
        parcel =
          parcelList[abstractParcel.category].topRightBottom[randomParcelIndex];
        parcel.parcelLayerWithStrings = _.unzip(parcel.parcelLayerWithStrings);
        parcel.parcelLayerWithStrings = _.unzip(parcel.parcelLayerWithStrings);
        parcel.parcelLayerWithStrings = _.unzip(parcel.parcelLayerWithStrings);
      }

      if (abstractParcelExits === 'ooox') {
        const categoryOfParcelsAmount =
          parcelList[abstractParcel.category].topRightBottom.length;
        const randomParcelIndex = _.random(0, categoryOfParcelsAmount - 1);
        parcel =
          parcelList[abstractParcel.category].topRightBottom[randomParcelIndex];
      }
      // Parcels TOP-RIGHT
      if (abstractParcelExits === 'xxoo') {
        const categoryOfParcelsAmount =
          parcelList[abstractParcel.category].topRight.length;
        const randomParcelIndex = _.random(0, categoryOfParcelsAmount - 1);
        parcel =
          parcelList[abstractParcel.category].topRight[randomParcelIndex];
        parcel.parcelLayerWithStrings = _.unzip(parcel.parcelLayerWithStrings);
        parcel.parcelLayerWithStrings = _.unzip(parcel.parcelLayerWithStrings);
      }

      if (abstractParcelExits === 'oxxo') {
        const categoryOfParcelsAmount =
          parcelList[abstractParcel.category].topRight.length;
        const randomParcelIndex = _.random(0, categoryOfParcelsAmount - 1);
        parcel =
          parcelList[abstractParcel.category].topRight[randomParcelIndex];
        parcel.parcelLayerWithStrings = _.unzip(parcel.parcelLayerWithStrings);
        parcel.parcelLayerWithStrings = _.unzip(parcel.parcelLayerWithStrings);
        parcel.parcelLayerWithStrings = _.unzip(parcel.parcelLayerWithStrings);
      }

      if (abstractParcelExits === 'ooxx') {
        const categoryOfParcelsAmount =
          parcelList[abstractParcel.category].topRight.length;
        const randomParcelIndex = _.random(0, categoryOfParcelsAmount - 1);
        parcel =
          parcelList[abstractParcel.category].topRight[randomParcelIndex];
      }

      if (abstractParcelExits === 'xoox') {
        const categoryOfParcelsAmount =
          parcelList[abstractParcel.category].topRight.length;
        const randomParcelIndex = _.random(0, categoryOfParcelsAmount - 1);
        parcel =
          parcelList[abstractParcel.category].topRight[randomParcelIndex];
        parcel.parcelLayerWithStrings = _.unzip(parcel.parcelLayerWithStrings);
      }

      // Parcels TOP-BOTTOM
      if (abstractParcelExits === 'oxox') {
        const categoryOfParcelsAmount =
          parcelList[abstractParcel.category].topBottom.length;
        const randomParcelIndex = _.random(0, categoryOfParcelsAmount - 1);
        parcel =
          parcelList[abstractParcel.category].topBottom[randomParcelIndex];
      }

      if (abstractParcelExits === 'xoxo') {
        const categoryOfParcelsAmount =
          parcelList[abstractParcel.category].topBottom.length;
        const randomParcelIndex = _.random(0, categoryOfParcelsAmount - 1);
        parcel =
          parcelList[abstractParcel.category].topBottom[randomParcelIndex];
        parcel.parcelLayerWithStrings = _.unzip(parcel.parcelLayerWithStrings);
      }

      // Parcels TOP
      if (abstractParcelExits === 'oxxx') {
        const categoryOfParcelsAmount =
          parcelList[abstractParcel.category].top.length;
        const randomParcelIndex = _.random(0, categoryOfParcelsAmount - 1);
        parcel = parcelList[abstractParcel.category].top[randomParcelIndex];
      }

      if (abstractParcelExits === 'xoxx') {
        const categoryOfParcelsAmount =
          parcelList[abstractParcel.category].top.length;
        const randomParcelIndex = _.random(0, categoryOfParcelsAmount - 1);
        parcel = parcelList[abstractParcel.category].top[randomParcelIndex];
        parcel.parcelLayerWithStrings = _.unzip(parcel.parcelLayerWithStrings);
      }

      if (abstractParcelExits === 'xxox') {
        const categoryOfParcelsAmount =
          parcelList[abstractParcel.category].top.length;
        const randomParcelIndex = _.random(0, categoryOfParcelsAmount - 1);
        parcel = parcelList[abstractParcel.category].top[randomParcelIndex];
        parcel.parcelLayerWithStrings = _.unzip(parcel.parcelLayerWithStrings);
        parcel.parcelLayerWithStrings = _.unzip(parcel.parcelLayerWithStrings);
      }

      if (abstractParcelExits === 'xxxo') {
        const categoryOfParcelsAmount =
          parcelList[abstractParcel.category].top.length;
        const randomParcelIndex = _.random(0, categoryOfParcelsAmount - 1);
        parcel = parcelList[abstractParcel.category].top[randomParcelIndex];
        parcel.parcelLayerWithStrings = _.unzip(parcel.parcelLayerWithStrings);
        parcel.parcelLayerWithStrings = _.unzip(parcel.parcelLayerWithStrings);
        parcel.parcelLayerWithStrings = _.unzip(parcel.parcelLayerWithStrings);
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
  };
};
