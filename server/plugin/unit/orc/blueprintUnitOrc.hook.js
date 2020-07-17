// @format

'use strict';

// What does this module do?
// It attaches blueprint for this unit
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.entities.blueprint_unit_orc = {
      blueprint: {
        unitName: 'orc',
        tier: 4,
        life: 49,
        movement: 6,
        maneuverPoints: 2,
        recruitCost: 350,
        maneuvers: {
          walk: true,
          melee: {
            damage: 6
          }
        }
      }
    };

    done();
  });
};
