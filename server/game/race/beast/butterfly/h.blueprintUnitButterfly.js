// @format

'use strict';

// What does this module do?
// It attaches blueprint for this unit
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.unit.butterfly = {
      unitName: 'butterfly',
      tier: 1,
      life: 4,
      movement: 7,
      maneuverPoints: 2,
      cost: { gold: 50 },
      maneuvers: {
        fly: true,
        melee: {
          damage: 2
        }
      }
    };

    done();
  });
};
