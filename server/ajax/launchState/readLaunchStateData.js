// @format

'use strict';

const debug = require('debug')('cogs:readLaunchStateData');

module.exports = (db) => {
  return (gameId, callback) => {
    (function init() {
      debug('init');
      findGame();
    })();

    function findGame() {
      const query = { _id: gameId };
      const options = {};

      db.collection('gameCollection').findOne(query, options, (error, game) => {
        if (error || !game) {
          debug('findMapLayer: error:', error);
          callback('Cannot find game' + JSON.stringify(error));
          return;
        }

        debug('findGame', game._id);
        generateStateData(game);
      });
    }

    function generateStateData(game) {
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
