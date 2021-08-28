// @format

'use strict';

// What does this module do?
// It attaches blueprint for this fortification
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.fortification.maze = {
      fortificationName: 'maze',
      namePretty: 'Maze',
      race: 'beast',
      cost: {
        gold: 7500,
        crystal: 5,
        stone: 15,
        wood: 5
      }
    };

    done();
  });
};
