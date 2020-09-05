// @format

'use strict';

// What does this module do?
// It attaches blueprint for this unit
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.unit.minotaur = {
      unitName: 'minotaur',
      tier: 5,
      life: 91,
      movement: 3,
      maneuverPoints: 2,
      cost: { gold: 600 },
      maneuvers: {
        walk: true,
        melee: {
          damage: 15
        }
      }
    };

    done();
  });
};
