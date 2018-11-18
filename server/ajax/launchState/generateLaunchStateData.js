// @format

'use strict';

const debug = require('debug')('cogs:generateLaunchStateData');

module.exports = () => {
  return (game, callback) => {
    (function init() {
      debug('init');
      generateData();
    })();

    function generateData() {
      const launchStateData = {};
      launchStateData.state = game.state;

      launchStateData.playerArray = [];
      game.playerArray.forEach((player) => {
        launchStateData.playerArray.push({ name: player.name });
      });

      debug(
        'generateData: launchStateData.playerArray.length',
        launchStateData.playerArray.length
      );
      sendStateData(launchStateData);
    }

    function sendStateData(launchStateData) {
      debug('sendStateData');
      callback(null, launchStateData);
    }
  };
};
