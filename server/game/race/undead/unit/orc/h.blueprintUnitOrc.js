// @format

'use strict';

// What does this module do?
// It attaches blueprint for this unit
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.unit.orc = {
      unitName: 'orc',
      tier: 4,
      life: 49,
      movement: 6,
      maneuverPoints: 2,
      cost: { gold: 350 },
      maneuvers: {
        walk: true,
        melee: {
          damage: 6
        }
      }
    };

    done();
  });
};
