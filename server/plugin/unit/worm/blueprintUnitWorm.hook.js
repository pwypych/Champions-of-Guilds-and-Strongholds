// @format

'use strict';

// What does this module do?
// It attaches blueprint for this unit
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.entities.blueprint_unit_worm = {
      blueprint: {
        unitName: 'worm',
        tier: 4,
        life: 42,
        movement: 5,
        maneuverPoints: 2,
        recruitCost: 320,
        maneuvers: {
          fly: true,
          melee: {
            damage: 7
          }
        }
      }
    };

    done();
  });
};
