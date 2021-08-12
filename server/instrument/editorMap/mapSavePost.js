// @format

'use strict';

const debug = require('debug')('cogs:mapSavePost');

module.exports = (environment, db) => {
  return (req, res) => {
    (function init() {
      debug('// Takes ajax requests to save a map from editorMap');

      validateRequestBody();
    })();

    function validateRequestBody() {

      if (!req.body.mapId) {
        debug('vaidateRequestBody: error: ', req.body);
        res.status(503).send('503 Error - Wrong POST parameter');
        return;
      }

      const mapId = req.body.mapId;

      if (!req.body.mapLayerWithStrings) {
        debug('validateRequestBody: Missing req.body.direction!');
        res.status(503).send('503 Error - no load direction!');
        return;
      }

      const mapLayerWithStrings = req.body.mapLayerWithStrings;

      debug('validateRequestBody: mapId:', mapId);
      debug('validateRequestBody: mapLayerWithStrings:', mapLayerWithStrings);
      updateSetMapLayerWithStrings(mapId, mapLayerWithStrings);
    }

    function updateSetMapLayerWithStrings(mapId, mapLayerWithStrings) {
      const $set = {};
      $set.mapLayerWithStrings = mapLayerWithStrings;

      const query = { _id: mapId };
      const update = { $set: $set };
      const options = {};

      db.collection('mapCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateSetMapLayerWithStrings: error:', error);
          }

          sendResponse();
          debug('updateSetMapLayerWithStrings: Success!');
        }
      );
    }

    function sendResponse() {
      debug('sendResponse: No Errors!');
      res.send({ error: 0 });
    }
  };
};
