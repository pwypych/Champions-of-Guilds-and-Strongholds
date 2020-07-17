// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (inject, done) => {
    inject.entities.blueprint_figure_eyeball = {
      blueprint: {
        figureName: 'eyeball',
        unitAmounts: { eyeball: 6 }
      }
    };

    done();
  });
};
