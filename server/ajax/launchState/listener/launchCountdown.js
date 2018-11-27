// @format

'use strict';

const debug = require('debug')('cogs:launchCountdown');

module.exports = (walkie, db) => {
  return () => {
    (function init() {
      debug('init');
      onPrepareHeroHigure();
    })();

    function onPrepareHeroHigure() {
      walkie.onEvent('prepareHeroFigure_', 'launchCountdown.js', (data) => {
        debug('onPrepareHeroHigure');
        fireCountdown(data.gameId);
      });
    }

    function fireCountdown(gameId) {
      debug('fireCountdown');
      setTimeout(() => {
        updateGameState(gameId);
      }, 5000);
    }

    function updateGameState(gameId) {
      const query = { _id: gameId };
      const update = { $set: { state: 'worldState' } };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateGameState: error:', error);
            return;
          }
          // End
        }
      );
    }
  };
};
