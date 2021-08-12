// @format

'use strict';

const debug = require('debug')('cogs:mapCreateNewPost');
const validator = require('validator');
const _ = require('lodash');

module.exports = (environment, db) => {
  return (req, res) => {
    (function init() {
      debug('// Takes POST request to create a new map from editorMap');

      validateRequestBody();
    })();

    function validateRequestBody() {
      if (!req.body.mapId) {
        debug('vaidateRequestBody: error: ', req.body);
        res.status(503).send('Map Name cannot be empty');
        return;
      }

      const mapId = req.body.mapId;

      if (!req.body.width) {
        debug('vaidateRequestBody: error: ', req.body);
        res.status(503).send('503 Error - Wrong POST parameter [1]');
        return;
      }

      if (!validator.isNumeric(req.body.width)) {
        debug('vaidateRequestBody: error: ', req.body);
        res.status(503).send('503 Error - Wrong POST parameter [2]');
        return;
      }

      const width = parseInt(req.body.width, 10);

      if (!req.body.height) {
        debug('vaidateRequestBody: error: ', req.body);
        res.status(503).send('503 Error - Wrong POST parameter [3]');
        return;
      }

      if (!validator.isNumeric(req.body.height)) {
        debug('vaidateRequestBody: error: ', req.body);
        res.status(503).send('503 Error - Wrong POST parameter [4]');
        return;
      }

      const height = parseInt(req.body.height, 10);

      debug('validateRequestBody: mapId:', mapId);
      debug('validateRequestBody: width:', width);
      debug('validateRequestBody: height:', height);
      generateMap(mapId, width, height);
    }

    function generateMap(mapId, width, height) {
      const mapLayerWithStrings = [];

      _.times(height, () => {
        const row = [];
        _.times(width, () => {
          row.push('empty');
        });
        mapLayerWithStrings.push(row);
      });

      insertMap(mapId, mapLayerWithStrings);
    }

    function insertMap(mapId, mapLayerWithStrings) {
      const map = {
        _id: mapId,
        mapLayerWithStrings: mapLayerWithStrings
      };

      db.collection('mapCollection').insertOne(map, (error) => {
        if (error) {
          debug('insertGame: error:', error);
          res
            .status(503)
            .send('503 Service Unavailable - Cannot insert map instance');
        }

        debug('insertMap: mapId:', mapId);
        sendResponse();
      });
    }

    function sendResponse() {
      debug('sendResponse()');
      debug('******************** redirect ********************');
      res.redirect(environment.baseurl + '/editorMap/mapChoose');
    }
  };
};
