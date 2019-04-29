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
      ctx.parcelList = res.locals.parcelList;

      generateSuperParcel(ctx);
    })();

    function generateSuperParcel(ctx) {
      const parcelList = ctx.parcelList;
      const superParcel = [];
      const width = 3;
      const height = 3;
      const treasureParcelCount = parcelList.treasure.length - 1;
      debug('generateSuperParcel: treasureParcelCount:', treasureParcelCount);

      for (let y = 0; y < width; y += 1) {
        superParcel[y] = [];
        for (let x = 0; x < height; x += 1) {
          superParcel[y][x] =
            parcelList.treasure[_.random(0, treasureParcelCount)];
          debug('generateSuperParcel: parcel id:', superParcel[y][x]._id);
        }
      }

      superParcel[0][0] = parcelList.castle[1];
      superParcel[width - 1][height - 1] = parcelList.castle[0];

      ctx.superParcel = superParcel;
      forEachSuperParcelY(ctx);
    }

    function forEachSuperParcelY(ctx) {
      const superParcel = ctx.superParcel;
      const result = [];
      ctx.result = result;

      superParcel.forEach((superParcelRow, superParcelY) => {
        ctx.superParcelRow = superParcelRow;
        ctx.superParcelY = superParcelY;
        forEachSuperParcelX(ctx);
      });

      debug('forEachSuperParcelY: result.length:', result.length);
      debug('forEachSuperParcelY: result[0].length:', result[0].length);
      res.locals.mapObject = result;
      next();
    }

    function forEachSuperParcelX(ctx) {
      const superParcelRow = ctx.superParcelRow;
      superParcelRow.forEach((parcel, superParcelX) => {
        ctx.parcel = parcel;
        ctx.superParcelX = superParcelX;
        forEachParcelY(ctx);
      });
    }

    function forEachParcelY(ctx) {
      const parcel = ctx.parcel;
      const result = ctx.result;
      const superParcelY = ctx.superParcelY;
      parcel.parcelLayerWithStrings.forEach((parcelRow, parcelY) => {
        const y = parcelY + 7 * superParcelY;
        if (!_.isArray(result[y])) {
          result[y] = [];
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
      const superParcelX = ctx.superParcelX;
      const result = ctx.result;
      const y = ctx.y;
      const monsterArray = ctx.monsterArray;

      parcelRow.forEach((tile, parcelX) => {
        const x = parcelX + 7 * superParcelX;
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
