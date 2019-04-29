// @format

'use strict';

const debug = require('debug')('cogs:generateParcelList');

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
          generateParcelList(parcelArray);
        });
    }

    function generateParcelList(parcelArray) {
      const parcelList = {};
      parcelList.castle = [];
      parcelList.treasure = [];

      parcelArray.forEach((parcel) => {
        if (parcel.category === 'castle') {
          parcelList.castle.push(parcel);
        }

        if (parcel.category === 'treasure') {
          parcelList.treasure.push(parcel);
        }
      });

      debug(
        'generateParcelList: parcelList.castle.length:',
        parcelList.castle.length
      );
      debug(
        'generateParcelList: parcelList.treasure.length:',
        parcelList.treasure.length
      );

      res.locals.parcelList = parcelList;
      next();
    }
  };
};
