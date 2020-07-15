// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (ctx, done) => {
    ctx.entities.blueprint_figure_crazyWizard = {
      blueprint: {
        figureName: 'crazyWizard',
        unitAmounts: { crazyWizard: 6 }
      }
    };

    done();
  });
};
