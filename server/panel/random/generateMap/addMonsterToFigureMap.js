// @format

'use strict';

const debug = require('debug')('cogs:addMonsterToFigureMap');
const _ = require('lodash');

module.exports = (environment, hook) => {
  return (req, res, next) => {
    (function init() {
      debug('// Fill figureMap with monster fiugres');
      const ctx = {};
      ctx.land = res.locals.land;
      ctx.figureMap = res.locals.mapObject;

      generateMonsterBlueprints(ctx);
    })();

    function generateMonsterBlueprints(ctx) {
      const injected = { monsterArray: [] };
      hook.run('registerMonster_', injected, (error) => {
        ctx.monsterArray = injected.monsterArray;
        debug('generateMonsterBlueprints: ', ctx.monsterArray.length);
        sortMonsterArrayByTier(ctx);
      });
    }

    function sortMonsterArrayByTier(ctx) {
      const monsterArray = ctx.monsterArray;
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

      abstractFigureMap.forEach((abstractFigureMapRow, abstractFigureMapY) => {
        ctx.abstractFigureMapRow = abstractFigureMapRow;
        ctx.abstractFigureMapY = abstractFigureMapY;

        forEachAbstractMonsterFigure(ctx);
      });

      next();
    }

    function forEachAbstractMonsterFigure(ctx) {
      const abstractFigureMapRow = ctx.abstractFigureMapRow;
      const monsterTierArray = ctx.monsterTierArray;
      const figureMap = ctx.figureMap;
      const y = ctx.abstractFigureMapY;

      abstractFigureMapRow.forEach((abstractFigure, x) => {
        const tier = abstractFigure.level;
        const figureChance = _.random(0, 99);
        const monsterIndex = _.random(0, monsterTierArray[tier].length - 1);
        if (abstractFigure.figureName === 'abstractMonster') {
          figureMap[y][x] = monsterTierArray[tier][monsterIndex].name;
          return;
        }

        if (abstractFigure.figureName === 'abstractMonsterMaybe') {
          figureMap[y][x] = 'empty';

          if (figureChance > 60) {
            figureMap[y][x] = monsterTierArray[tier][monsterIndex].name;
          }
        }
      });
    }
  };
};
