// @format

'use strict';

// What does this module do?
// It attaches blueprint for this unit
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.entities.blueprint_unit_crazyWizard = {
      blueprint: {
        unitName: 'crazyWizard',
        tier: 3,
        life: 24,
        movement: 3,
        maneuverPoints: 2,
        recruitCost: 240,
        maneuvers: {
          fly: true,
          melee: {
            damage: 1
          },
          shoot: {
            damage: 5
          }
        }
      }
    };

    done();
  });
};
