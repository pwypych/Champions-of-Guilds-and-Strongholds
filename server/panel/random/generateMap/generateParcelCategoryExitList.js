// @format

'use strict';

const debug = require('debug')('cogs:generateParcelCategoryExitList');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Find all parcels from parcelCollection and generate list of them'
      );

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
          generateParcelCategoryExitList(parcelArray);
        });
    }

    function generateParcelCategoryExitList(parcelArray) {
      const parcelCategoryExitList = {};
      parcelCategoryExitList.castle = {};
      parcelCategoryExitList.countryside = {};

      parcelArray.forEach((parcel) => {
        if (parcel.category === 'castle') {
          if (!parcelCategoryExitList.castle[parcel.exits]) {
            parcelCategoryExitList.castle[parcel.exits] = [];
          }
          parcelCategoryExitList.castle[parcel.exits].push(parcel);
        }

        if (parcel.category === 'countryside') {
          if (!parcelCategoryExitList.countryside[parcel.exits]) {
            parcelCategoryExitList.countryside[parcel.exits] = [];
          }
          parcelCategoryExitList.countryside[parcel.exits].push(parcel);
        }
      });

      debug(
        'generateParcelCategoryExitList: parcelCategoryExitList.castle.all.length:',
        parcelCategoryExitList.castle.all.length
      );
      debug(
        'generateParcelCategoryExitList: parcelCategoryExitList.countryside.all.length:',
        parcelCategoryExitList.countryside.all.length
      );

      debug(
        'generateParcelCategoryExitList: parcelCategoryExitList',
        parcelCategoryExitList
      );

      res.locals.parcelCategoryExitList = parcelCategoryExitList;
      next();
    }
  };
};
