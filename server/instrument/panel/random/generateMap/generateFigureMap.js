// @format

'use strict';

const debug = require('debug')('cogs:generateFigureMap');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Generate 2d figureMap filled with empty figures');
      const ctx = {};
      ctx.land = res.locals.land;

      forEachAbstractFigureMapY(ctx);
    })();

    function forEachAbstractFigureMapY(ctx) {
      const abstractFigureMap = ctx.land.abstractFigureMap;
      const figureMap = [];
      ctx.figureMap = figureMap;

      abstractFigureMap.forEach((abstractFigureMapRow, abstractFigureMapY) => {
        ctx.abstractFigureMapRow = abstractFigureMapRow;
        ctx.abstractFigureMapY = abstractFigureMapY;
        if (!figureMap[abstractFigureMapY]) {
          figureMap[abstractFigureMapY] = [];
        }

        forEachAbstractFigureMapX(ctx);
      });

      res.locals.mapObject = figureMap;
      next();
    }

    function forEachAbstractFigureMapX(ctx) {
      const abstractFigureMapRow = ctx.abstractFigureMapRow;
      abstractFigureMapRow.forEach((abstractFigure, abstractFigureMapX) => {
        const figureMap = ctx.figureMap;
        const y = ctx.abstractFigureMapY;
        const x = abstractFigureMapX;

        figureMap[y][x] = 'empty';
      });
    }
  };
};
