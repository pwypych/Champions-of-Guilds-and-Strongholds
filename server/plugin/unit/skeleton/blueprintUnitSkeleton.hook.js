// @format

'use strict';

// What does this module do?
// It attaches blueprint for this unit
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.entities.blueprint_unit_skeleton = {
      blueprint: {
        unitName: 'skeleton',
        tier: 1,
        life: 7,
        movement: 5,
        maneuverPoints: 2,
        recruitCost: 70,
        maneuvers: {
          walk: true,
          melee: {
            damage: 2
          }
        }
      }
    };

    done();
  });
};
