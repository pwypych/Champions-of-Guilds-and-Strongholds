// @format

'use strict';

const debug = require('debug')('cogs:addMonsterToFigureMap');
const _ = require('lodash');

const barrierArray = ['dirt', 'rock', 'tree'];

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Fill figureMap with barrier figures');
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

        forEachAbstractBarrierFigure(ctx);
      });

      next();
    }

    function forEachAbstractBarrierFigure(ctx) {
      const abstractFigureMapRow = ctx.abstractFigureMapRow;
      const y = ctx.abstractFigureMapY;
      const figureMap = ctx.figureMap;

      abstractFigureMapRow.forEach((abstractFigure, x) => {
        const figureChance = _.random(0, 99);

        if (abstractFigure.figureName === 'abstractBarrier') {
          figureMap[y][x] = barrierArray[_.random(0, barrierArray.length - 1)];
          return;
        }

        if (abstractFigure.figureName === 'abstractBarrierMaybe') {
          figureMap[y][x] = 'empty';

          if (figureChance > 40) {
            figureMap[y][x] =
              barrierArray[_.random(0, barrierArray.length - 1)];
          }
        }
      });
    }
  };
};
