// @format

'use strict';

const debug = require('debug')('cogs:generateFigureMap');
const _ = require('lodash');

const treasureArray = ['stone', 'wood', 'gold', 'crystal'];
const barrierArray = ['dirt', 'rock', 'tree'];

module.exports = (environment, unitBlueprint) => {
  return (req, res, next) => {
    (function init() {
      debug('// Generate figureMap based on parcelMap');
      const ctx = {};
      ctx.land = res.locals.land;

      generateMonsterArray(ctx);
    })();

    function generateMonsterArray(ctx) {
      const monsterArray = [];
      _.forEach(unitBlueprint(), (unit, name) => {
        monsterArray.push({ name: name, tier: unit.tier });
      });

      ctx.monsterArray = monsterArray;
      forEachAbstractFigureMapY(ctx);
    }

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
        // debug('forEachAbstractFigureMapX: abstractFigure:', abstractFigure);
        const figureMap = ctx.figureMap;
        const monsterArray = ctx.monsterArray;
        const abstractFigureMapY = ctx.abstractFigureMapY;

        const figureChance = _.random(0, 99);

        // debug('forEachParcelX: abstractFigure:', abstractFigure);
        figureMap[abstractFigureMapY][abstractFigureMapX] =
          abstractFigure.figureName;

        if (abstractFigure.figureName === 'treasure') {
          figureMap[abstractFigureMapY][abstractFigureMapX] =
            treasureArray[_.random(0, treasureArray.length - 1)];
          return;
        }

        if (abstractFigure.figureName === 'treasureMaybe') {
          figureMap[abstractFigureMapY][abstractFigureMapX] = 'empty';

          if (figureChance > 80) {
            figureMap[abstractFigureMapY][abstractFigureMapX] =
              treasureArray[_.random(0, treasureArray.length - 1)];
          }
          return;
        }

        if (abstractFigure.figureName === 'monster') {
          do {
            const monsterIndex = _.random(0, monsterArray.length - 1);
            if (monsterArray[monsterIndex].tier === abstractFigure.level) {
              figureMap[abstractFigureMapY][abstractFigureMapX] =
                monsterArray[monsterIndex].name;
            }
          } while (
            figureMap[abstractFigureMapY][abstractFigureMapX] === 'monster'
          );

          return;
        }

        if (abstractFigure.figureName === 'monsterMaybe') {
          figureMap[abstractFigureMapY][abstractFigureMapX] = 'empty';

          if (figureChance > 60) {
            do {
              const monsterIndex = _.random(0, monsterArray.length - 1);
              if (monsterArray[monsterIndex].tier === abstractFigure.level) {
                figureMap[abstractFigureMapY][abstractFigureMapX] =
                  monsterArray[monsterIndex].name;
              }
            } while (
              figureMap[abstractFigureMapY][abstractFigureMapX] === 'empty'
            );
          }
          return;
        }

        if (abstractFigure.figureName === 'barrier') {
          figureMap[abstractFigureMapY][abstractFigureMapX] =
            barrierArray[_.random(0, barrierArray.length - 1)];
          return;
        }

        if (abstractFigure.figureName === 'barrierMaybe') {
          figureMap[abstractFigureMapY][abstractFigureMapX] = 'empty';

          if (figureChance > 40) {
            figureMap[abstractFigureMapY][abstractFigureMapX] =
              barrierArray[_.random(0, barrierArray.length - 1)];
          }
        }
      });
    }
  };
};
