// @format

'use strict';

const debug = require('debug')('cogs:generateParcelList');
const _ = require('lodash');

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
          debug('findParcels: parcelArray[0]:', parcelArray[0]);
          generateParcelList(parcelArray);
        });
    }

    function generateParcelList(parcelArray) {
      const parcelList = {};
      parcelList.castle = {};
      parcelList.treasure = {};

      parcelArray.forEach((parcel) => {
        if (parcel.category === 'castle') {
          if (!_.isArray(parcelList.castle[parcel.exits])) {
            parcelList.castle[parcel.exits] = [];
          }
          parcelList.castle[parcel.exits].push(parcel);
        }

        if (parcel.category === 'treasure') {
          if (!_.isArray(parcelList.treasure[parcel.exits])) {
            parcelList.treasure[parcel.exits] = [];
          }
          parcelList.treasure[parcel.exits].push(parcel);
        }
      });

      debug(
        'generateParcelList: parcelList.castle.length:',
        parcelList.castle.length
      );
      debug('generateParcelList: parcelList.treasure:', parcelList.treasure);

      res.locals.parcelList = parcelList;
      next();
    }
  };
};
