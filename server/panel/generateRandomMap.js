// @format

'use strict';

const debug = require('debug')('cogs:generateRandomMap');
const _ = require('lodash');

const treasureArray = ['stone', 'wood', 'gold', 'crystal'];
const barrierArray = ['dirt', 'rock', 'tree'];

module.exports = (environment, unitBlueprint) => {
  return (req, res, next) => {
    (function init() {
      debug('// Generate random map based on parcels');
      const ctx = {};
      ctx.land = res.locals.land;

      forEachLandAbstractMapY(ctx);
    })();

    function forEachLandAbstractMapY(ctx) {
      const land = ctx.land;
      const result = [];
      ctx.result = result;

      land.abstractParcelMap.forEach((landRow, landY) => {
        ctx.landRow = landRow;
        ctx.landY = landY;
        forEachLandX(ctx);
      });

      debug('forEachLandAbstractMapY: result.length:', result.length);
      debug('forEachLandAbstractMapY: result[0].length:', result[0].length);
      res.locals.mapObject = result;
      next();
    }

    function forEachLandX(ctx) {
      const landRow = ctx.landRow;
      landRow.forEach((abstractParcel, landX) => {
        ctx.abstractParcel = abstractParcel;
        ctx.landX = landX;
        insertParcelbyAbstractParcel(ctx);
      });
    }

    function insertParcelbyAbstractParcel(ctx) {
      const result = ctx.result;
      const abstractParcelMap = ctx.land.abstractParcelMap;
      const landY = ctx.landY;
      const landX = ctx.landX;
      const parcelList = res.locals.parcelList;
      const parcelCategory = abstractParcelMap[landY][landX].category;
      debug('insertParcelbyAbstractParcel: parcelCategory:', parcelCategory);
      debug('insertParcelbyAbstractParcel: landX:', landX);
      debug('insertParcelbyAbstractParcel: landY:', landY);
      debug(
        'insertParcelbyAbstractParcel: abstractParcelMap[landY][landX]:',
        abstractParcelMap[landY][landX]
      );

      result[landY][landX] = parcelList[parcelCategory][0];
      debug(
        'insertParcelbyAbstractParcel: result[landY][landX]:',
        result[landY][landX]
      );
      forEachParcelY(ctx);
    }

    function forEachParcelY(ctx) {
      const abstractParcel = ctx.abstractParcel;
      const result = ctx.result;
      const landY = ctx.landY;
      // debug('forEachParcelY: res.locals.parcelList:', res.locals.parcelList);
      abstractParcel.parcelLayerWithStrings.forEach(
        (abstractParcelRow, abstractParcelY) => {
          const y = abstractParcelY + 7 * landY;
          if (!_.isArray(result[y])) {
            result[y] = [];
          }

          ctx.abstractParcelRow = abstractParcelRow;
          ctx.abstractParcelY = abstractParcelY;
          ctx.y = y;
          generateMonsterArray(ctx);
        }
      );
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
      const abstractParcelRow = ctx.abstractParcelRow;
      const landX = ctx.landX;
      const result = ctx.result;
      const y = ctx.y;
      const monsterArray = ctx.monsterArray;

      abstractParcelRow.forEach((tile, abstractParcelX) => {
        const x = abstractParcelX + 7 * landX;
        const figureChance = _.random(0, 99);

        // debug('forEachParcelX: tile:', tile);
        result[y][x] = tile;

        if (tile === 'treasure') {
          result[y][x] = treasureArray[_.random(0, treasureArray.length - 1)];
          return;
        }

        if (tile === 'treasureMaybe') {
          result[y][x] = 'empty';

          if (figureChance > 80) {
            result[y][x] = treasureArray[_.random(0, treasureArray.length - 1)];
          }
          return;
        }

        if (tile === 'monster') {
          result[y][x] = monsterArray[_.random(0, monsterArray.length - 1)];
          return;
        }

        if (tile === 'monsterMaybe') {
          result[y][x] = 'empty';

          if (figureChance > 60) {
            result[y][x] = monsterArray[_.random(0, monsterArray.length - 1)];
          }
          return;
        }

        if (tile === 'barrier') {
          result[y][x] = barrierArray[_.random(0, barrierArray.length - 1)];
          return;
        }

        if (tile === 'barrierMaybe') {
          result[y][x] = 'empty';

          if (figureChance > 40) {
            result[y][x] = barrierArray[_.random(0, barrierArray.length - 1)];
          }
        }
      });
    }
  };
};
