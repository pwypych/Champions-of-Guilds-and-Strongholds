// @format

'use strict';

// const debug = require('debug')('cogs:mineWoodBlueprintHook');

module.exports = (hook) => {
  hook.attach('generateBlueprints_', (ctx, done) => {
    ctx.entities.blueprint_mineStone = {
      blueprintType: 'visitable',
      collision: true
    };

    done();
  });
};
