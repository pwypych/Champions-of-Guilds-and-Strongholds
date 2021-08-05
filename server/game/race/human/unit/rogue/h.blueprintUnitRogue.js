// @format

'use strict';

// What does this module do?
// It attaches blueprint for this unit
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.unit.rogue = {
      unitName: 'rogue',
      fortificationRequired: 'suburbs',
      tier: 2,
      life: 20,
      movement: 6,
      maneuverPoints: 2,
      cost: { gold: 100 },
      maneuvers: {
        walk: true,
        melee: {
          damage: 3
        }
      }
    };

    done();
  });
};
