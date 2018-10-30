// @format

'use strict';

const debug = require('debug')('cogs:readMap');

module.exports = (db) => {
  return (req, res) => {
    (function init() {
      debug('init');
      findMapLayer();
    })();

    function findMapLayer() {
      const gameInstanceId = req.query.gameInstanceId;
      const query = { _id: gameInstanceId };
      const options = {};

      db.collection('gameInstanceCollection').findOne(
        query,
        options,
        (error, gameInstanceObject) => {
          if (error || !gameInstanceObject) {
            debug('findMapLayer: error:', error);
            res
              .status(503)
              .send('503 Service Unavailable - Cannot find gameInstance');
            return;
          }

          debug('findMapLayer', gameInstanceObject._id);
          sendMapLayer(gameInstanceObject.mapLayer);
        }
      );
    }

    function sendMapLayer(mapLayer) {
      debug('sendMapLayer');
      res.send(mapLayer);
    }
  };
};
