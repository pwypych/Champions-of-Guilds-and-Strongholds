// @format

'use strict';

// const debug = require('debug')('cogs:mineWoodBlueprintHook');

// What does this module do?
// It attaches blueprint for mineStone
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (ctx, done) => {
    ctx.entities.blueprint_mineStone = {
      blueprintType: 'visitable',
      collision: true
    };

    done();
  });
};
