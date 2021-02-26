// @format

'use strict';

const debug = require('debug')('cogs:landCreateNewPost');
const validator = require('validator');
const _ = require('lodash');

module.exports = (environment, db) => {
  return (req, res) => {
    (function init() {
      debug('// Takes POST request to create a new land from editorLand');

      validateRequestBody();
    })();

    function validateRequestBody() {
      if (!req.body.landId) {
        debug('vaidateRequestBody: error: ', req.body);
        res.status(503).send('Land Name cannot be empty');
        return;
      }

      const landId = req.body.landId;

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

      debug('validateRequestBody: landId:', landId);
      debug('validateRequestBody: width:', width);
      debug('validateRequestBody: height:', height);
      generateLand(landId, width, height);
    }

    function generateLand(landId, width, height) {
      const landLayer = [];

      _.times(height, () => {
        const row = [];
        _.times(width, () => {
          row.push({
            level: 1,
            conditions: [],
          });
        });
        landLayer.push(row);
      });

      insertLand(landId, landLayer);
    }

    function insertLand(landId, landLayer) {
      const land = {
        _id: landId,
        landLayer: landLayer
      };

      db.collection('landCollection').insertOne(land, (error) => {
        if (error) {
          debug('insertGame: error:', error);
          res
            .status(503)
            .send('503 Service Unavailable - Cannot insert land instance');
        }

        debug('insertLand: landId:', landId);
        sendResponse();
      });
    }

    function sendResponse() {
      debug('sendResponse()');
      debug('******************** redirect ********************');
      res.redirect(environment.baseurl + '/editorLand/landChoose');
    }
  };
};
