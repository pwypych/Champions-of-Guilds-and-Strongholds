// @format

'use strict';

const debug = require('debug')('cogs:addNonAbstractToFgureMap');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Generate figureMap based on parcelMap');
      const ctx = {};
      ctx.land = res.locals.land;
      ctx.figureMap = res.locals.mapObject;

      forEachAbstractFigureMapY(ctx);
    })();

    function forEachAbstractFigureMapY(ctx) {
      const abstractFigureMap = ctx.land.abstractFigureMap;

      abstractFigureMap.forEach((abstractFigureMapRow, abstractFigureMapY) => {
        ctx.abstractFigureMapRow = abstractFigureMapRow;
        ctx.abstractFigureMapY = abstractFigureMapY;

        forEachAbstractTreasureFigure(ctx);
      });

      next();
    }

    function forEachAbstractTreasureFigure(ctx) {
      const abstractFigureMapRow = ctx.abstractFigureMapRow;
      const y = ctx.abstractFigureMapY;
      const figureMap = ctx.figureMap;

      abstractFigureMapRow.forEach((abstractFigure, x) => {
        const abstractFigurePrefix = abstractFigure.figureName.substring(0, 8);
        if (abstractFigurePrefix !== 'abstract') {
          figureMap[y][x] = abstractFigure.figureName;
        }
      });
    }
  };
};
