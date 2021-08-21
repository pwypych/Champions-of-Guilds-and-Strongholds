// @format

'use strict';

// What does this module do?
// It attaches blueprint for this unit
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.unit.warrior = {
      unitName: 'warrior',
      fortificationRequired: 'arena',
      tier: 3,
      life: 35,
      movement: 5,
      maneuverPoints: 2,
      cost: { gold: 200 },
      maneuvers: {
        walk: true,
        melee: {
          damage: 4
        }
      }
    };

    done();
  });
};
