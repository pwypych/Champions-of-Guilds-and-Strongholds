// @format

'use strict';

// What does this module do?
// It attaches blueprint for this unit
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.unit.skeleton = {
      unitName: 'skeleton',
      fortificationRequired: 'cementary',
      tier: 1,
      life: 7,
      movement: 5,
      maneuverPoints: 2,
      cost: { gold: 70 },
      maneuvers: {
        walk: true,
        melee: {
          damage: 2
        }
      }
    };

    done();
  });
};
