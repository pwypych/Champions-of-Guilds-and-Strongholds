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

      sortMonsterArrayByTier(ctx, monsterArray);
    }

    function sortMonsterArrayByTier(ctx, monsterArray) {
      const monsterTierArray = {
        tier1: [],
        tier2: [],
        tier3: [],
        tier4: [],
        tier5: []
      };

      monsterArray.forEach((monster) => {
        const tier = 'tier' + monster.tier;
        monsterTierArray[tier].push(monster);
      });

      ctx.monsterTierArray = monsterTierArray;
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

      // debug('forEachAbstractFigureMapY: figureMap:', figureMap);

      res.locals.mapObject = figureMap;
      next();
    }

    function forEachAbstractFigureMapX(ctx) {
      const abstractFigureMapRow = ctx.abstractFigureMapRow;
      abstractFigureMapRow.forEach((abstractFigure, abstractFigureMapX) => {
        const figureMap = ctx.figureMap;
        const abstractFigureMapY = ctx.abstractFigureMapY;

        figureMap[abstractFigureMapY][abstractFigureMapX] =
          abstractFigure.figureName;
      });

      forEachAbstractMonsterFigure(ctx);
    }

    function forEachAbstractMonsterFigure(ctx) {
      const abstractFigureMapRow = ctx.abstractFigureMapRow;
      const monsterTierArray = ctx.monsterTierArray;

      abstractFigureMapRow.forEach((abstractFigure, x) => {
        const y = ctx.abstractFigureMapY;
        const figureMap = ctx.figureMap;

        const tier = 'tier' + abstractFigure.level;
        const figureChance = _.random(0, 99);
        const monsterIndex = _.random(0, monsterTierArray[tier].length - 1);

        if (abstractFigure.figureName === 'monster') {
          figureMap[y][x] = monsterTierArray[tier][monsterIndex].name;
          return;
        }

        if (abstractFigure.figureName === 'monsterMaybe') {
          figureMap[y][x] = 'empty';

          if (figureChance > 60) {
            figureMap[y][x] = monsterTierArray[tier][monsterIndex].name;
          }
        }
      });

      forEachAbstractBarrierFigure(ctx);
    }

    function forEachAbstractBarrierFigure(ctx) {
      const abstractFigureMapRow = ctx.abstractFigureMapRow;

      abstractFigureMapRow.forEach((abstractFigure, x) => {
        const y = ctx.abstractFigureMapY;
        const figureMap = ctx.figureMap;

        const figureChance = _.random(0, 99);

        if (abstractFigure.figureName === 'barrier') {
          figureMap[y][x] = barrierArray[_.random(0, barrierArray.length - 1)];
          return;
        }

        if (abstractFigure.figureName === 'barrierMaybe') {
          figureMap[y][x] = 'empty';

          if (figureChance > 40) {
            figureMap[y][x] =
              barrierArray[_.random(0, barrierArray.length - 1)];
          }
        }
      });

      forEachAbstractTreasureFigure(ctx);
    }

    function forEachAbstractTreasureFigure(ctx) {
      const abstractFigureMapRow = ctx.abstractFigureMapRow;

      abstractFigureMapRow.forEach((abstractFigure, x) => {
        const y = ctx.abstractFigureMapY;
        const figureMap = ctx.figureMap;

        const figureChance = _.random(0, 99);

        if (abstractFigure.figureName === 'treasure') {
          figureMap[y][x] =
            treasureArray[_.random(0, treasureArray.length - 1)];
          return;
        }

        if (abstractFigure.figureName === 'treasureMaybe') {
          figureMap[y][x] = 'empty';

          if (figureChance > 40) {
            figureMap[y][x] =
              treasureArray[_.random(0, treasureArray.length - 1)];
          }
        }
      });

      // forEachAbstractBarrierFigure(ctx);
    }
  };
};
