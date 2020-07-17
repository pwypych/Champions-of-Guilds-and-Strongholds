// @format

'use strict';

// What does this module do?
// It attaches blueprint for this unit
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.entities.blueprint_unit_wizard = {
      blueprint: {
        unitName: 'wizard',
        tier: 4,
        life: 28,
        movement: 6,
        maneuverPoints: 2,
        recruitCost: 300,
        maneuvers: {
          fly: true,
          melee: {
            damage: 8
          },
          shoot: {
            damage: 2
          }
        }
      }
    };

    done();
  });
};
