// @format

'use strict';

const debug = require('debug')('cogs:readWorldStateData');

module.exports = (db) => {
  return (gameId, callback) => {
    (function init() {
      debug('init');
      findGame();
    })();

    function findGame() {
      const query = { _id: gameId };
      const options = {};

      db.collection('gameCollection').findOne(
        query,
        options,
        (error, gameObject) => {
          if (error || !gameObject) {
            debug('findMapLayer: error:', error);
            callback('Cannot find game' + JSON.stringify(error));
            return;
          }

          debug('findGame', gameObject._id);
          generateWorldStateData(gameObject);
        }
      );
    }

    function generateWorldStateData(gameObject) {
      const worldStateData = {};
      worldStateData.state = gameObject.state;

      worldStateData.mapLayer = gameObject.mapLayer;

      debug(
        'generateWorldStateData: worldStateData.players.length',
        worldStateData.mapLayer.length
      );
      sendStateData(worldStateData);
    }

    function sendStateData(worldStateData) {
      debug('sendStateData');
      callback(null, worldStateData);
    }
  };
};
