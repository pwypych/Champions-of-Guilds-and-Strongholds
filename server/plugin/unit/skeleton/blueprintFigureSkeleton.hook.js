// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (inject, done) => {
    inject.entities.blueprint_figure_skeleton = {
      blueprint: {
        figureName: 'skeleton',
        unitAmounts: { skeleton: 10 }
      }
    };

    done();
  });
};
