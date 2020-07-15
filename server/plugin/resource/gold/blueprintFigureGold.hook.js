// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (ctx, done) => {
    ctx.entities.blueprint_figure_gold = {
      blueprint: {
        figureName: 'gold',
        resource: { name: 'gold', amount: 1000 }
      }
    };

    done();
  });
};
