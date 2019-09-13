// @format

'use strict';

const debug = require('debug')('cogs:addMonsterToFigureMap');
const _ = require('lodash');

module.exports = (environment, unitBlueprint) => {
  return (req, res, next) => {
    (function init() {
      debug('// Fill figureMap with monster fiugres');
      const ctx = {};
      ctx.land = res.locals.land;
      ctx.figureMap = res.locals.mapObject;

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

        debug('forEachAbstractMonsterFigure: tier:', tier);
        debug(
          'forEachAbstractMonsterFigure: abstractFigure.figureName:',
          abstractFigure.figureName
        );
        debug(
          'forEachAbstractMonsterFigure: figureMap[y][x]:',
          figureMap[y][x]
        );

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
