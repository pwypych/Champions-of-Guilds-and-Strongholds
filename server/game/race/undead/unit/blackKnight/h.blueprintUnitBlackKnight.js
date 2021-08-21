// @format

'use strict';

// What does this module do?
// It attaches blueprint for this unit
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (injected, done) => {
    injected.blueprint.unit.blackKnight = {
      unitName: 'blackKnight',
      fortificationRequired: 'blackCastle',
      tier: 5,
      life: 77,
      movement: 4,
      maneuverPoints: 2,
      cost: { gold: 550, crystal: 1 },
      maneuvers: {
        walk: true,
        melee: {
          damage: 13
        }
      }
    };

    done();
  });
};
