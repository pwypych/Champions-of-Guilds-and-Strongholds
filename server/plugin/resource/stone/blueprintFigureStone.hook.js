// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (ctx, done) => {
    ctx.entities.blueprint_figure_stone = {
      blueprint: {
        figureName: 'stone',
        resource: { name: 'stone', amount: 5 }
      }
    };

    done();
  });
};
