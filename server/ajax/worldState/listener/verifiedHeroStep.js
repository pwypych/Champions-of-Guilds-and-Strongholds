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
      walkie.onEvent(
        'verifiedHeroStep_',
        'verifiedHeroStep.js',
        (data) => {
          const ctx = {};
          ctx.gameId = data.gameId;
          ctx.heroId = data.heroId;
          ctx.verifiedHeroStep = data.verifiedHeroStep;

          debug('onVerifiedHeroStep: verifiedHeroStep:', ctx.verifiedHeroStep);
          debug('onVerifiedHeroStep: gameId:', ctx.gameId);
          updateHeroPosition(ctx);
        },
        false
      );
    }

    function updateHeroPosition(ctx) {
      const gameId = ctx.gameId;
      const heroId = ctx.heroId;
      const verifiedHeroStep = ctx.verifiedHeroStep;

      const query = { _id: gameId };

      const mongoFieldToSetHeroX = heroId + '.position.x';
      const mongoFieldToSetHeroY = heroId + '.position.y';
      const $set = {};
      $set[mongoFieldToSetHeroX] = verifiedHeroStep.toX;
      $set[mongoFieldToSetHeroY] = verifiedHeroStep.toY;

      const mongoFieldToSetMovement = heroId + '.heroStats.movement';
      const $inc = {};
      $inc[mongoFieldToSetMovement] = -1;

      const update = { $set: $set, $inc: $inc };
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
