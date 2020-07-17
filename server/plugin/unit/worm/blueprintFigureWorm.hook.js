// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (inject, done) => {
    inject.entities.blueprint_figure_worm = {
      blueprint: {
        figureName: 'worm',
        unitAmounts: { worm: 5 }
      }
    };

    done();
  });
};
