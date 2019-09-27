// @format

'use strict';

const debug = require('debug')('cogs:addMonsterToFigureMap');
const _ = require('lodash');

const treasureArray = ['stone', 'wood', 'gold', 'crystal'];

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
        const figureChance = _.random(0, 99);

        if (abstractFigure.figureName === 'abstractTreasure') {
          figureMap[y][x] =
            treasureArray[_.random(0, treasureArray.length - 1)];
          return;
        }

        if (abstractFigure.figureName === 'abstractTreasureMaybe') {
          figureMap[y][x] = 'empty';

          if (figureChance > 40) {
            figureMap[y][x] =
              treasureArray[_.random(0, treasureArray.length - 1)];
          }
        }
      });
    }
  };
};
