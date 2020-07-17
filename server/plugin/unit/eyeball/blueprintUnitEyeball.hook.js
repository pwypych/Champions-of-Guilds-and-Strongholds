// @format

'use strict';

// What does this module do?
// It attaches blueprint for this unit
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.entities.blueprint_unit_eyeball = {
      blueprint: {
        unitName: 'eyeball',
        tier: 3,
        life: 31,
        movement: 4,
        maneuverPoints: 2,
        recruitCost: 200,
        maneuvers: {
          walk: true,
          melee: {
            damage: 5
          }
        }
      }
    };

    done();
  });
};
