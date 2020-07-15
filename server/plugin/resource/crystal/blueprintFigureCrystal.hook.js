// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (ctx, done) => {
    ctx.entities.blueprint_figure_crystal = {
      blueprint: {
        figureName: 'crystal',
        resource: { name: 'crystal', amount: 3 }
      }
    };

    done();
  });
};
