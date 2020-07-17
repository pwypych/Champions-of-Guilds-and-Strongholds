// @format

'use strict';

// What does this module do?
// It attaches blueprint for this unit
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.entities.blueprint_unit_ranger = {
      blueprint: {
        unitName: 'ranger',
        tier: 1,
        life: 5,
        movement: 4,
        maneuverPoints: 2,
        recruitCost: 60,
        maneuvers: {
          walk: true,
          melee: {
            damage: 1
          },
          shoot: {
            damage: 1
          }
        }
      }
    };

    done();
  });
};
