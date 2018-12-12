// @format

'use strict';

const debug = require('debug')('cogs:verifiedHeroStep');

// What does this module do?
// Move hero by one step
module.exports = (walkie, db) => {
  return () => {
    (function init() {
      debug('init');
      onVerifiedHeroStep();
    })();

    function onVerifiedHeroStep() {
      walkie.onEvent('verifiedHeroStep_', 'verifiedHeroStep.js', (data) => {
        const gameId = data.gameId;
        const verifiedHeroStep = data.verifiedHeroStep;
        const playerIndex = data.playerIndex;

        debug('onVerifiedHeroStep: verifiedHeroStep:', verifiedHeroStep);
        debug('onVerifiedHeroStep: gameId:', gameId);
        debug('onVerifiedHeroStep: playerIndex:', playerIndex);
        updateHeroPosition(gameId, verifiedHeroStep, playerIndex);
      });
    }

    function updateHeroPosition(gameId, verifiedHeroStep, playerIndex) {
      const query = { _id: gameId };

      const mongoFieldToSetHeroX = 'playerArray.' + playerIndex + '.hero.x';
      const mongoFieldToSetHeroY = 'playerArray.' + playerIndex + '.hero.y';
      const $set = {};
      $set[mongoFieldToSetHeroX] = verifiedHeroStep.toX;
      $set[mongoFieldToSetHeroY] = verifiedHeroStep.toY;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error, result) => {
          if (error) {
            debug(': ERROR: insert mongo error:', error);
            return;
          }

          debug('updateHeroPosition', result.result);
        }
      );
    }
  };
};
