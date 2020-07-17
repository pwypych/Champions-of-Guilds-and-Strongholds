// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.entities.blueprint_figure_wood = {
      blueprint: {
        figureName: 'wood',
        resource: { name: 'wood', amount: 7 }
      }
    };

    done();
  });
};
