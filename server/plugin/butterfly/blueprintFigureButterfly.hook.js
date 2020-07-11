// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (ctx, done) => {
    ctx.entities.blueprint_figure_butterfly = {
      blueprintType: 'figure',
      unitAmounts: { butterfly: 10 }
    };

    done();
  });
};
