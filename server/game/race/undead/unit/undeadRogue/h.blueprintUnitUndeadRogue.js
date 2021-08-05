// @format

'use strict';

// What does this module do?
// It attaches blueprint for this unit
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.unit.undeadRogue = {
      unitName: 'undeadRogue',
      fortificationRequired: 'brotherhood',
      tier: 2,
      life: 16,
      movement: 4,
      maneuverPoints: 2,
      cost: { gold: 110 },
      maneuvers: {
        walk: true,
        melee: {
          damage: 5
        }
      }
    };

    done();
  });
};
