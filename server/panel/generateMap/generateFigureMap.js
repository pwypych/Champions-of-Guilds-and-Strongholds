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

      forEachAbstractParcelMapY(ctx);
    })();

    function forEachAbstractParcelMapY(ctx) {
      const parcelMap = ctx.land.parcelMap;
      const figureMap = [];
      ctx.figureMap = figureMap;

      parcelMap.forEach((parcelMapRow, parcelMapY) => {
        ctx.parcelMapRow = parcelMapRow;
        ctx.parcelMapY = parcelMapY;
        if (!figureMap[parcelMapY]) {
          figureMap[parcelMapY] = [];
        }
        forEachAbstractParcelMapX(ctx);
      });
      res.locals.mapObject = figureMap;
      next();
    }

    function forEachAbstractParcelMapX(ctx) {
      const parcelMapRow = ctx.parcelMapRow;
      parcelMapRow.forEach((parcel, parcelMapX) => {
        ctx.parcel = parcel;
        ctx.parcelMapX = parcelMapX;

        debug('forEachAbstractParcelMapX: parcel:', parcel);

        forEachParcelY(ctx);
      });
    }

    function forEachParcelY(ctx) {
      const parcel = ctx.parcel;
      const figureMap = ctx.figureMap;
      const parcelMapY = ctx.parcelMapY;

      // debug(
      //   'forEachParcelY: parcel.parcelLayerWithStrings:',
      //   parcel.parcelLayerWithStrings
      // );

      parcel.parcelLayerWithStrings.forEach((parcelRow, parcelY) => {
        const y = parcelY + 7 * parcelMapY;
        if (!_.isArray(figureMap[y])) {
          figureMap[y] = [];
        }

        ctx.parcelRow = parcelRow;
        ctx.parcelY = parcelY;
        ctx.y = y;
        generateMonsterArray(ctx);
      });
    }

    function generateMonsterArray(ctx) {
      const monsterArray = [];
      _.forEach(unitBlueprint(), (unit, name) => {
        monsterArray.push(name);
      });

      ctx.monsterArray = monsterArray;
      forEachParcelX(ctx);
    }

    function forEachParcelX(ctx) {
      const parcelRow = ctx.parcelRow;
      const parcelMapX = ctx.parcelMapX;
      const figureMap = ctx.figureMap;
      const y = ctx.y;
      const monsterArray = ctx.monsterArray;

      parcelRow.forEach((tile, parcelX) => {
        const x = parcelX + 7 * parcelMapX;
        const figureChance = _.random(0, 99);

        // debug('forEachParcelX: tile:', tile);
        figureMap[y][x] = tile;

        if (tile === 'treasure') {
          figureMap[y][x] =
            treasureArray[_.random(0, treasureArray.length - 1)];
          return;
        }

        if (tile === 'treasureMaybe') {
          figureMap[y][x] = 'empty';

          if (figureChance > 80) {
            figureMap[y][x] =
              treasureArray[_.random(0, treasureArray.length - 1)];
          }
          return;
        }

        if (tile === 'monster') {
          figureMap[y][x] = monsterArray[_.random(0, monsterArray.length - 1)];
          return;
        }

        if (tile === 'monsterMaybe') {
          figureMap[y][x] = 'empty';

          if (figureChance > 60) {
            figureMap[y][x] =
              monsterArray[_.random(0, monsterArray.length - 1)];
          }
          return;
        }

        if (tile === 'barrier') {
          figureMap[y][x] = barrierArray[_.random(0, barrierArray.length - 1)];
          return;
        }

        if (tile === 'barrierMaybe') {
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
