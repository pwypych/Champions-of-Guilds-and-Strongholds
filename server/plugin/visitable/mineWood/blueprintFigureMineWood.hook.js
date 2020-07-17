// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (inject, done) => {
    inject.entities.blueprint_figure_mineWood = {
      blueprint: {
        figureName: 'mineWood',
        collision: true,
      }
    };

    done();
  });
};
