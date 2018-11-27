// @format

'use strict';

const debug = require('debug')('nope:cogs:generateWorldStateData');

module.exports = () => {
  return (game, playerIndex, callback) => {
    (function init() {
      debug('init');
      generateData();
    })();

    function generateData() {
      const worldStateData = {};
      worldStateData.state = game.state;
      worldStateData.playerIndex = playerIndex;

      worldStateData.mapLayer = game.mapLayer;

      debug(
        'generateData: worldStateData.mapLayer.length',
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
