// @format

'use strict';

// What does this module do?
// It attaches blueprint for this unit
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.entities.blueprint_unit_butterfly = {
      blueprint: {
        unitName: 'butterfly',
        tier: 1,
        life: 4,
        movement: 7,
        maneuverPoints: 2,
        recruitCost: 50,
        maneuvers: {
          fly: true,
          melee: {
            damage: 2
          }
        }
      }
    };

    done();
  });
};
