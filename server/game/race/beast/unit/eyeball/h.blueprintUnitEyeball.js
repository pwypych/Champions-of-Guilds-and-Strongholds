// @format

'use strict';

// What does this module do?
// It attaches blueprint for this unit
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.unit.eyeball = {
      unitName: 'eyeball',
      tier: 3,
      life: 31,
      movement: 4,
      maneuverPoints: 2,
      cost: { gold: 200 },
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
