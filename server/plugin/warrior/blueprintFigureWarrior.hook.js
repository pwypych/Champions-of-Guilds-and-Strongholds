// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (ctx, done) => {
    ctx.entities.blueprint_figure_warrior = {
      blueprintType: 'figure',
      figureName: 'warrior',
      unitAmounts: { warrior: 6 }
    };

    done();
  });
};
