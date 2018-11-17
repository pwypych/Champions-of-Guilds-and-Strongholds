// @format

'use strict';

const debug = require('debug')('cogs:readWorldStateData');

module.exports = () => {
  return (game, callback) => {
    (function init() {
      debug('init');
      generateWorldStateData();
    })();

    function generateWorldStateData() {
      const worldStateData = {};
      worldStateData.state = game.state;

      worldStateData.mapLayer = game.mapLayer;

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
