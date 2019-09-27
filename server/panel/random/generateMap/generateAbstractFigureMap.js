// @format

'use strict';

const debug = require('debug')('cogs:generateAbstractFigureMap');
const _ = require('lodash');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Generate abstractFigureMap based on parcelMap');
      const ctx = {};
      ctx.land = res.locals.land;

      forEachParcelMapY(ctx);
    })();

    function forEachParcelMapY(ctx) {
      const land = ctx.land;
      const parcelMap = ctx.land.parcelMap;
      const abstractFigureMap = [];
      ctx.abstractFigureMap = abstractFigureMap;

      parcelMap.forEach((parcelMapRow, parcelMapY) => {
        ctx.parcelMapRow = parcelMapRow;
        ctx.parcelMapY = parcelMapY;
        if (!abstractFigureMap[parcelMapY]) {
          abstractFigureMap[parcelMapY] = [];
        }

        forEachParcelMapX(ctx);
      });
      land.abstractFigureMap = abstractFigureMap;
      next();
    }

    function forEachParcelMapX(ctx) {
      const parcelMapRow = ctx.parcelMapRow;
      parcelMapRow.forEach((parcel, parcelMapX) => {
        ctx.parcel = parcel;
        ctx.parcelMapX = parcelMapX;

        forEachParcelY(ctx);
      });
    }

    function forEachParcelY(ctx) {
      const parcel = ctx.parcel;
      const abstractFigureMap = ctx.abstractFigureMap;
      const parcelMapY = ctx.parcelMapY;

      parcel.parcelLayerWithStrings.forEach((parcelRow, parcelY) => {
        const y = parcelY + 7 * parcelMapY;
        if (!_.isArray(abstractFigureMap[y])) {
          abstractFigureMap[y] = [];
        }

        ctx.parcelRow = parcelRow;
        ctx.parcelY = parcelY;
        ctx.y = y;
        forEachParcelX(ctx);
      });
    }

    function forEachParcelX(ctx) {
      const parcel = ctx.parcel;
      const parcelRow = ctx.parcelRow;
      const parcelMapX = ctx.parcelMapX;
      const abstractFigureMap = ctx.abstractFigureMap;
      const y = ctx.y;

      parcelRow.forEach((abstractFigure, parcelX) => {
        const x = parcelX + 7 * parcelMapX;

        abstractFigureMap[y][x] = {
          figureName: abstractFigure,
          level: parcel.level
        };
      });
    }
  };
};
