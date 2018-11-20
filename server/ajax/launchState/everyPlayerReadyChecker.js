// @format

'use strict';

const debug = require('debug')('cogs:everyPlayerReadyChecker');

module.exports = (db) => {
  return (gameId, callback) => {
    (function init() {
      debug('init');
      findGameById();
    })();

    function findGameById() {
      const query = { _id: gameId };
      const options = {};

      db.collection('gameCollection').findOne(query, options, (error, game) => {
        if (error) {
          debug('findGameById: error:', error);
          callback('find mongo error:' + JSON.stringify(error));
          return;
        }

        if (!game) {
          callback('game object is empty');
          return;
        }

        debug('findGameById', game._id);
        checkEveryPlayerReady(game);
      });
    }

    function checkEveryPlayerReady(game) {
      let isEveryPlayerReady = true;
      game.playerArray.forEach((player) => {
        if (player.ready === 'no') {
          isEveryPlayerReady = false;
        }
      });

      callback(null, isEveryPlayerReady);
    }
  };
};
