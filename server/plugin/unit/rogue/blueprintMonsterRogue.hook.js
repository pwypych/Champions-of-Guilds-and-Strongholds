// @format

'use strict';

// What does this module do?
// It registeres NPC monster for map generation and random figure assignment
module.exports = (hook) => {
  hook.attach('registerMonster_', (injected, done) => {
    injected.monsterArray.push({
      name: 'rogue',
      tier: 2
    });

    done();
  });
};
