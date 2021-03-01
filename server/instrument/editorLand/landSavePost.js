// @format

'use strict';

const debug = require('debug')('cogs:landSavePost');
const _ = require('lodash');

module.exports = (environment, db) => {
  return (req, res) => {
    (function init() {
      debug('// Takes ajax requests to save a land from editorLand');

      validateRequestBody();
    })();

    function validateRequestBody() {
      if (!req.body.landId) {
        debug('vaidateRequestBody: error: ', req.body);
        res.status(503).send('503 Error - Wrong POST parameter');
        return;
      }

      const landId = req.body.landId;

      if (!req.body.landLayer) {
        debug('validateRequestBody: Missing req.body.direction!');
        res.status(503).send('503 Error - no load direction!');
        return;
      }

      const landLayer = req.body.landLayer;

      debug('validateRequestBody: landId:', landId);
      debug('validateRequestBody: landLayer:', landLayer);
      ensureEmptyArrayAndBooleans(landId, landLayer);
    }

    function ensureEmptyArrayAndBooleans(landId, landLayer) {
      landLayer.forEach((row, y) => {
        row.forEach((parcel, x) => {
          debug('ensureEmptyArrayAndBooleans', parcel);
          if (parcel.conditions) {
            const conditions = parcel.conditions;
            _.each(conditions, (condition, index) => {
              const monster = (condition.monster === 'true');
              const random = (condition.random === 'true');
              landLayer[y][x].conditions[index].monster = monster;
              landLayer[y][x].conditions[index].random = random;
            });
          } else {
            landLayer[y][x].conditions = [];
          }
        });
      });

      debug('ensureEmptyArrayAndBooleans');
      updateSetLandLayer(landId, landLayer);
    }

    function updateSetLandLayer(landId, landLayer) {
      const $set = {};
      $set.landLayer = landLayer;

      const query = { _id: landId };
      const update = { $set: $set };
      const options = {};

      db.collection('landCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateSetLandLayer: error:', error);
          }

          sendResponse();
          debug('updateSetLandLayer: Success!');
        }
      );
    }

    function sendResponse() {
      debug('sendResponse: No Errors!');
      res.send({ error: 0 });
    }
  };
};
