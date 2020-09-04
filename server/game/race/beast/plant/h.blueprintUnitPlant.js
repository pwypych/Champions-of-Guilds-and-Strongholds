// @format

'use strict';

// What does this module do?
// It attaches blueprint for this unit
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.unit.plant = {
      unitName: 'plant',
      tier: 2,
      life: 14,
      movement: 3,
      maneuverPoints: 2,
      cost: 130,
      maneuvers: {
        walk: true,
        melee: {
          damage: 1
        },
        shoot: {
          damage: 3
        }
      }
    };

    done();
  });
};
