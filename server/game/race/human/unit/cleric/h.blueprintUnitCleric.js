// @format

'use strict';

// What does this module do?
// It attaches blueprint for this unit
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.unit.cleric = {
      unitName: 'cleric',
      fortificationRequired: 'monastery',
      tier: 5,
      life: 63,
      movement: 6,
      maneuverPoints: 2,
      cost: { gold: 500, crystal: 1 },
      maneuvers: {
        walk: true,
        melee: {
          damage: 10
        }
      }
    };

    done();
  });
};
