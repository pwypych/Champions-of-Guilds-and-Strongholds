// @format

'use strict';

const debug = require('debug')('cogs:generateLaunchStateData');

module.exports = () => {
  return (game, callback) => {
    (function init() {
      debug('init');
      generateStateData();
    })();

    function generateStateData() {
      const launchStateData = {};
      launchStateData.state = game.state;

      launchStateData.players = [];
      game.playerArray.forEach((player) => {
        launchStateData.players.push({ name: player.name });
      });

      debug(
        'generateStateData: launchStateData.players.length',
        launchStateData.players.length
      );
      sendStateData(launchStateData);
    }

    function sendStateData(launchStateData) {
      debug('sendStateData');
      callback(null, launchStateData);
    }
  };
};
