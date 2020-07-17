// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.entities.blueprint_figure_minotaur = {
      blueprint: {
        figureName: 'minotaur',
        unitAmounts: { minotaur: 4 }
      }
    };

    done();
  });
};
