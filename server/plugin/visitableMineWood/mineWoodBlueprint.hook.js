// @format

'use strict';

// const debug = require('debug')('cogs:mineWoodBlueprintHook');

// What does this module do?
// It attaches blueprint for mineWood
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (ctx, done) => {
    ctx.entities.blueprint_mineWood = {
      blueprintType: 'visitable',
      collision: true
    };

    done();
  });
};
