// @format

'use strict';

const debug = require('debug')('cogs:generateRandomMap');
const _ = require('lodash');

const monsterArray = [
  'butterfly',
  'skeleton',
  'ranger',
  'plant',
  'undeadRogue'
];
const treasureArray = ['stone', 'wood', 'gold', 'crystal'];
const barrierArray = ['dirt', 'rock', 'tree'];

module.exports = (environment, unitBlueprint, db) => {
  return (req, res, next) => {
    (function init() {
      debug('// Generate random map based on parcels');

      findParcels();
    })();

    function findParcels() {
      const query = {};
      const options = {};

      db.collection('parcelCollection')
        .find(query, options)
        .toArray((error, parcelArray) => {
          if (error) {
            debug('findParcels: error:', error);
            res
              .status(503)
              .send(
                '503 Service Unavailable: Mongo error, cannot run find on gameCollection'
              );
            return;
          }

          debug('findParcels: parcelArray.length:', parcelArray.length);
          sortParcelArray(parcelArray);
        });
    }

    function sortParcelArray(parcelArray) {
      const sortedParcelObject = {};
      sortedParcelObject.castle = [];
      sortedParcelObject.treasure = [];
      let randomParcel;

      parcelArray.forEach((parcel) => {
        if (parcel.category === 'castle') {
          sortedParcelObject.castle.push(parcel);
        }

        if (parcel.category === 'treasure') {
          sortedParcelObject.treasure.push(parcel);
        }

        if (parcel.name === 'randomForest1') {
          randomParcel = parcel;
        }
      });

      debug(
        'sortParcelArray: sortedParcelObject.castle.length:',
        sortedParcelObject.castle.length
      );
      debug(
        'sortParcelArray: sortedParcelObject.treasure.length:',
        sortedParcelObject.treasure.length
      );

      generateSuperParcel(sortedParcelObject, randomParcel);
    }

    function generateSuperParcel(sortedParcelObject, randomParcel) {
      const superParcel = [];
      const width = 5;
      const height = 5;
      const treasureParcelCount = sortedParcelObject.treasure.length - 1;
      debug('generateSuperParcel: treasureParcelCount:', treasureParcelCount);

      for (let y = 0; y < width; y += 1) {
        superParcel[y] = [];
        for (let x = 0; x < height; x += 1) {
          superParcel[y][x] =
            sortedParcelObject.treasure[_.random(0, treasureParcelCount)];
        }
      }

      superParcel[0][0] = sortedParcelObject.castle[1];
      superParcel[width - 1][height - 1] = sortedParcelObject.castle[0];

      // superParcel[0][0] = randomParcel;
      // superParcel[0][1] = randomParcel;
      // superParcel[1][0] = randomParcel;

      debug('generateSuperParcel: superParcel.length:', superParcel.length);
      forEachSuperParcelY(superParcel);
    }

    function forEachSuperParcelY(superParcel) {
      const result = [];
      superParcel.forEach((superParcelRow, superParcelY) => {
        forEachSuperParcelX(superParcelRow, superParcelY, result);
      });

      debug('forEachSuperParcelY: result.length:', result.length);
      debug('forEachSuperParcelY: result[0].length:', result[0].length);
      res.locals.mapObject = result;
      next();
    }

    function forEachSuperParcelX(superParcelRow, superParcelY, result) {
      superParcelRow.forEach((parcel, superParcelX) => {
        forEachParcelY(parcel, superParcelY, superParcelX, result);
      });
    }

    function forEachParcelY(parcel, superParcelY, superParcelX, result) {
      parcel.parcelLayerWithStrings.forEach((parcelRow, parcelY) => {
        const y = parcelY + 7 * superParcelY;
        if (!_.isArray(result[y])) {
          result[y] = [];
        }
        forEachParcelX(parcelRow, parcelY, y, superParcelX, result);
      });
    }

    function forEachParcelX(parcelRow, parcelY, y, superParcelX, result) {
      parcelRow.forEach((tile, parcelX) => {
        const x = parcelX + 7 * superParcelX;
        const figureChance = _.random(0, 99);

        debug('forEachParcelX: tile:', tile);
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
          return;
        }
      });
    }
  };
};
